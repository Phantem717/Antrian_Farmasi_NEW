import { useEffect, useState } from "react";
import { Card, Col, Row, Typography, Divider } from "antd";
import VerificationAPI from "@/app/utils/api/Verification";
import MedicineAPI from "@/app/utils/api/Medicine";
import PickupAPI from "@/app/utils/api/Pickup";
import { getSocket } from "@/app/utils/api/socket";
import Marquee from "react-fast-marquee";

const { Title, Text } = Typography;

const NextQueue = () => {
  const [queues, setQueues] = useState({
    nextQueueRacik: [],
    nextQueueNonRacik: [],
    medicineRacik: [],
    medicineNonRacik: [],
    pickupRacik: [],
    pickupNonRacik: [],
    verificationQueue: [],
    pickupQueue: []
  });

  const socket = getSocket();

  useEffect(() => {
    const handleSocketResponse = (payload) => {
      const dateString = new Date().toISOString().split('T')[0];
      
      // Process verification data
      const verificationData = payload.data.verificationData
        .filter(task => task?.status && task.waiting_verification_stamp)
        .filter(task => {
          const stamp = typeof task.waiting_verification_stamp === 'string' 
            ? new Date(task.waiting_verification_stamp) 
            : task.waiting_verification_stamp;
          return (task.queue_number?.startsWith("RC") || task.queue_number?.startsWith("NR")) && 
            task.status.includes("verification") && 
            stamp.toISOString().split('T')[0] === dateString;
        })
        .map(task => ({
          queueNumber: task.queue_number,
          type: task.status_medicine,
          status: task.status === "waiting_verification" ? "Menunggu" 
            : task.status === "called_verification" ? "Dipanggil" 
            : task.status === "pending_verification" ? "Terlewat" 
            : task.status === "recalled_verification" ? "Dipanggil"
            : task.status === "processed_verification" ? "Verifikasi"
            : "-",
          patient_name: task.patient_name
        }));

      // Process medicine data
      const medicineData = payload.data.medicineData
        .filter(task => task?.status && task.waiting_medicine_stamp)
        .filter(task => {
          const stamp = typeof task.waiting_medicine_stamp === 'string' 
            ? new Date(task.waiting_medicine_stamp) 
            : task.waiting_medicine_stamp;
          return task.status.includes("waiting_medicine") && 
            stamp.toISOString().split('T')[0] === dateString;
        })
        .map(task => ({
          queueNumber: task.queue_number,
          type: task.status_medicine,
          status: task.status,
          patient_name: task.patient_name
        }));

      // Process pickup data
      const pickupData = payload.data.pickupData
        .filter(task => task?.status && task.waiting_pickup_medicine_stamp)
        .filter(task => {
          const stamp = typeof task.waiting_pickup_medicine_stamp === 'string' 
            ? new Date(task.waiting_pickup_medicine_stamp) 
            : task.waiting_pickup_medicine_stamp;
          return task.status.includes("pickup") && 
            task.status !== "completed_pickup_medicine" && 
            stamp.toISOString().split('T')[0] === dateString;
        })
        .map(task => ({
          queueNumber: task.queue_number,
          type: task.status_medicine,
          patient_name: task.patient_name,
          status: task.status === "waiting_pickup_medicine" ? "Menunggu" 
            : task.status === "called_pickup_medicine" ? "Dipanggil" 
            : task.status === "pending_pickup_medicine" ? "Terlewat" 
            : task.status === "recalled_pickup_medicine" ? "Dipanggil"
            : "-"
        }));

      setQueues({
        verificationQueue: verificationData,
        pickupQueue: pickupData,
        nextQueueRacik: verificationData.filter(task => task.type === "Racikan"),
        nextQueueNonRacik: verificationData.filter(task => task.type === "Non - Racikan"),
        medicineRacik: medicineData.filter(task => task.type === "Racikan"),
        medicineNonRacik: medicineData.filter(task => task.type === "Non - Racikan"),
        pickupRacik: pickupData.filter(task => task.type === "Racikan"),
        pickupNonRacik: pickupData.filter(task => task.type === "Non - Racikan"),
      });
    };

    socket.on('get_responses', handleSocketResponse);
    return () => socket.off('get_responses', handleSocketResponse);
  }, []);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Menunggu': return 'gold';
      case 'Dipanggil': return 'green';
      case 'Terlewat': return 'red';
      case 'Verifikasi': return 'blue';
      default: return 'black';
    }
  };

  const QueueCard = ({ title, queuesRacik, queuesNonRacik, color }) => (
    <Card 
      title={<Title level={4} className="text-center">{title}</Title>}
      headStyle={{ backgroundColor: color, color: 'white' }}
      style={{ height: '100%' }}
    >
      <Row gutter={16}>
        <Col span={12}>
          <Divider orientation="left" style={{ color: 'green' }}>Racikan</Divider>
          <div style={{ height: 500, overflow: 'hidden' }}>
            <Marquee direction="up" speed={50}>
              {queuesRacik.length > 0 ? (
                queuesRacik.map((queue, index) => (
                  <Card key={index} style={{ marginBottom: 16 }}>
                    <Title level={3}>{queue.queueNumber}</Title>
                    <Text type="secondary">{queue.patient_name}</Text>
                  </Card>
                ))
              ) : (
                <Text>Belum Ada Antrian</Text>
              )}
            </Marquee>
          </div>
        </Col>
        <Col span={12}>
          <Divider orientation="left" style={{ color: 'green' }}>Non-Racikan</Divider>
          <div style={{ height: 500, overflow: 'hidden' }}>
            <Marquee direction="up" speed={50}>
              {queuesNonRacik.length > 0 ? (
                queuesNonRacik.map((queue, index) => (
                  <Card key={index} style={{ marginBottom: 16 }}>
                    <Title level={3}>{queue.queueNumber}</Title>
                    <Text type="secondary">{queue.patient_name}</Text>
                  </Card>
                ))
              ) : (
                <Text>Belum Ada Antrian</Text>
              )}
            </Marquee>
          </div>
        </Col>
      </Row>
    </Card>
  );

  const VerificationCard = ({ queues, color }) => (
    <Card 
      title={<Title level={4} className="text-center">Proses Verifikasi</Title>}
      headStyle={{ backgroundColor: color, color: 'white' }}
      style={{ height: '100%' }}
    >
      <div style={{ height: 500, overflow: 'hidden' }}>
        <Marquee direction="up" speed={50}>
          {queues.length > 0 ? (
            queues.map((queue, index) => (
              <Card key={index} style={{ marginBottom: 16 }}>
                <Row gutter={8}>
                  <Col span={8}>
                    <Text strong>{queue.queueNumber}</Text>
                  </Col>
                  <Col span={8}>
                    <Text>{queue.type}</Text>
                  </Col>
                  <Col span={8}>
                    <Text style={{ color: getStatusColor(queue.status) }}>
                      {queue.status}
                    </Text>
                  </Col>
                </Row>
                <Text>{queue.patient_name}</Text>
              </Card>
            ))
          ) : (
            <Text>Belum Ada Antrian</Text>
          )}
        </Marquee>
      </div>
    </Card>
  );

  return (
    <div style={{ padding: 24 }}>
      <Row gutter={[24, 24]}>
        <Col xs={24} md={8}>
          <VerificationCard 
            queues={queues.verificationQueue} 
            color="#52c41a" // green
          />
        </Col>
        <Col xs={24} md={8}>
          <QueueCard 
            title="Proses Pembuatan Obat"
            queuesRacik={queues.medicineRacik}
            queuesNonRacik={queues.medicineNonRacik}
            color="#faad14" // yellow
          />
        </Col>

        <Col xs={24} md={8}>
          <QueueCard 
            title="Obat Telah Selesai"
            queuesRacik={queues.pickupRacik}
            queuesNonRacik={queues.pickupNonRacik}
            color="#52c41a" 
          />
        </Col>
      </Row>
    </div>
  );
};

export default NextQueue;