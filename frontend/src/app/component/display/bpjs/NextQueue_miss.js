import { useEffect, useRef, useState, useMemo } from "react";
import { getSocket } from "@/app/utils/api/socket";

const NextQueue = ({ location, verificationData, medicineData, pickupData }) => {
  const [currentDate, setCurrentDate] = useState(new Date().toDateString());
  const [hideName, setHideName] = useState(true);

  const [lastCalled, setLastCalled] = useState({
    racik: null,
    nonRacik: null
  });
  
  const [queues, setQueues] = useState({
    pickupRacik: [],
    pickupNonRacik: [],
    pickupTerlewatNonRacik: [],
    pickupTerlewatRacik: [],
    pickupQueue: []
  });

  const [times, setTimes] = useState({
    processTimeNon: 10,
    processTimeRacik: 10,
    pickupTimeNon: 10,
    pickupTimeRacik: 10
  });

  const socket = getSocket();

  function calculateTime(processLengthNon, processLengthRacik, pickupLengthNon, pickupLengthRacik) {
    const processTimeNon = processLengthNon < 3 ? 10 : Math.floor(processLengthNon * 1.5);
    const processTimeRacik = processLengthRacik < 3 ? 10 : Math.floor(processLengthRacik * 0.16);
    const pickupTimeNon = Math.min(pickupLengthNon < 3 ? 10 : Math.floor(pickupLengthNon * 1.5), 80);
    const pickupTimeRacik = Math.min(pickupLengthRacik < 3 ? 10 : Math.floor(pickupLengthRacik * 0.2), 80);
    return { processTimeNon, processTimeRacik, pickupTimeNon, pickupTimeRacik };
  }

  useEffect(() => {
    setLastCalled({
      racik: localStorage.getItem('lastCalled_racikan') 
        ? JSON.parse(localStorage.getItem('lastCalled_racikan')) 
        : null,
      nonRacik: localStorage.getItem('lastCalled_nonracikan') 
        ? JSON.parse(localStorage.getItem('lastCalled_nonracikan')) 
        : null
    });
  }, []);

  function hideNameAction(name) {
    if (!name) return "";
    return name
      .split(" ")
      .map(word => {
        if (word.length <= 2) return word;
        return word.slice(0, 2) + "*".repeat(word.length - 2);
      })
      .join(" ");
  }

  useEffect(() => {
    const socket = getSocket();
    
    const handleNameToggle = (payload) => {
      const newValue = payload.data.toString() === 'true';
      if (hideName !== newValue) {
        setHideName(newValue);
        localStorage.setItem('nameToggleState', newValue.toString());
      }
    };

    socket.on('send_nameToggle', handleNameToggle);

    const handleGetResponses = (payload) => {
      console.log("? GOT RESP", payload);

      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      yesterday.setHours(0, 0, 0, 0);

      const pickupData = payload.data.pickupData.map(task => {
        const taskDate = new Date(task.waiting_pickup_medicine_stamp);
        taskDate.setHours(0, 0, 0, 0);
        
        return {
          queueNumber: task.queue_number,
          type: task.status_medicine,
          patient_name: task.patient_name,
          isYesterday: taskDate.getTime() === yesterday.getTime(),
          status: task.status === "waiting_pickup_medicine" ? "Menunggu"
            : task.status === "called_pickup_medicine" ? "Dipanggil"
            : task.status === "pending_pickup_medicine" ? "Terlewat"
            : task.status === "recalled_pickup_medicine" ? "Dipanggil"
            : "-",
          waiting_pickup_medicine_stamp: new Date(task.waiting_pickup_medicine_stamp)
        };
      });

      setQueues({
        pickupRacik: pickupData.filter(task => task.type == "Racikan" && task.status != "Terlewat"),
        pickupNonRacik: pickupData.filter(task => task.type == "Non - Racikan" && task.status != "Terlewat"),
        pickupTerlewatRacik: pickupData.filter(task => task.type == "Racikan" && task.status == "Terlewat"),
        pickupTerlewatNonRacik: pickupData.filter(task => task.type == "Non - Racikan" && task.status == "Terlewat"),
      });

      const newTimes = calculateTime(
        pickupData.filter(task => task.type == "Non - Racikan" != "Terlewat").length,
        pickupData.filter(task => task.type == "Racikan" != "Terlewat").length,
        pickupData.filter(task => task.type == "Racikan" && task.status == "Terlewat").length,
        pickupData.filter(task => task.type == "Non - Racikan" && task.status == "Terlewat").length,
      );

      setTimes(newTimes);
    };

    const handleLatestPickup = (payload) => {
      const data = payload.data;
      
      setLastCalled(prev => {
        const newState = {
          racik: data.medicine_type === "Racikan" ? data : prev.racik,
          nonRacik: data.medicine_type !== "Racikan" ? data : prev.nonRacik
        };
        
        if (data.medicine_type === "Racikan") {
          localStorage.setItem('lastCalled_racikan', JSON.stringify(data));
        } else {
          localStorage.setItem('lastCalled_nonracikan', JSON.stringify(data));
        }
        
        return newState;
      });
    };

    if (socket) {
      socket.emit('get_initial_responses_pickup', { location });
      socket.on('get_responses', handleGetResponses);
      socket.on('send_latest_pickup', handleLatestPickup);
    }

    return () => {
      if (socket) {
        socket.off('get_responses', handleGetResponses);
        socket.off('send_latest_pickup', handleLatestPickup);
        socket.off('send_nameToggle', handleNameToggle);
      }
    };
  }, [socket, location]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (new Date().toDateString() !== currentDate) {
        setCurrentDate(new Date().toDateString());
        localStorage.removeItem('lastCalled_racikan');
        localStorage.removeItem('lastCalled_nonracikan');
        setLastCalled({ racik: null, nonRacik: null });
        window.location.reload();
      }
    }, 300000);
    return () => clearInterval(interval);
  }, [currentDate]);

  const getStatusColor = (status) => {
    switch(status) {
      case 'Menunggu': return 'text-yellow-600';
      case 'Dipanggil': return 'text-green-600';
      case 'Terlewat': return 'text-red-600';
      case 'Verifikasi': return 'text-blue-600';
      default: return 'text-black';
    }
  };

  const getStatusColourBorder = (status) => {
    switch(status) {
      case 'Menunggu': return 'border-2 border-yellow-500';
      case 'Dipanggil': return 'border-2 border-green-500';
      case 'Terlewat': return 'border-2 border-red-500';
      case 'Verifikasi': return 'border-2 border-blue-500';
      default: return '';
    }
  };

  const formatDateTime = (timestamp) => {
    if (!timestamp) return '--:--:--';
    
    try {
      const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
      if (isNaN(date.getTime())) return '--:--:--';
      
      const day = String(date.getUTCDate()).padStart(2, '0');
      const month = String(date.getUTCMonth() + 1).padStart(2, '0');
      const year = date.getUTCFullYear();
      const hours = String(date.getUTCHours()).padStart(2, '0');
      const minutes = String(date.getUTCMinutes()).padStart(2, '0');
      const seconds = String(date.getUTCSeconds()).padStart(2, '0');
      
      return `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    } catch {
      return '--:--:--';
    }
  };

  // ✅ Seamless Carousel Component
  const SeamlessCarousel = ({ chunks, duration, renderItem }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isTransitioning, setIsTransitioning] = useState(true);
    
    const loopedChunks = chunks.length > 0 ? [...chunks, chunks[0]] : chunks;
    
    useEffect(() => {
      if (chunks.length <= 1) return;

      const interval = setInterval(() => {
        setCurrentIndex((prev) => prev + 1);
      }, duration * 1000);

      return () => clearInterval(interval);
    }, [chunks.length, duration]);
    
    useEffect(() => {
      if (currentIndex === loopedChunks.length - 1) {
        setTimeout(() => {
          setIsTransitioning(false);
          setCurrentIndex(0);
          
          setTimeout(() => {
            setIsTransitioning(true);
          }, 50);
        }, duration * 1000);
      }
    }, [currentIndex, loopedChunks.length, duration]);

    if (chunks.length === 0) return null;

    return (
      <div style={{ height: "1060px", position: "relative", overflow: "hidden" }}>
        <div
          style={{
            display: "flex",
            transform: `translateX(-${currentIndex * 100}%)`,
            transition: isTransitioning ? "transform 0.5s ease-in-out" : "none",
            height: "100%"
          }}
        >
          {loopedChunks.map((group, idx) => (
            <div
              key={`slide-${idx}`}
              style={{
                minWidth: "100%",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                gap: "0.5rem"
              }}
            >
              {renderItem(group)}
            </div>
          ))}
        </div>
        
        {chunks.length > 1 && (
          <div style={{
            position: "absolute",
            bottom: "10px",
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            gap: "8px",
            zIndex: 10
          }}>
            {chunks.map((_, idx) => (
              <div
                key={idx}
                style={{
                  width: "10px",
                  height: "10px",
                  borderRadius: "50%",
                  backgroundColor: (currentIndex % chunks.length) === idx ? "#22c55e" : "#d1d5db",
                  transition: "background-color 0.3s"
                }}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  const QueuePickup = ({ title, queuesRacik, queuesNonRacik, bgColor }) => {
    const renderLastCalled = (type) => {
      const item = type === 'racik' ? lastCalled.racik : lastCalled.nonRacik;
      const label = type === 'racik' ? 'Racikan' : 'Non-Racikan';

      return (
        <div className="flex-1 bg-blue-600 p-4 rounded-lg" style={{ height: '500px' }}>
          <p className="text-6xl font-bold text-white text-center">Terakhir Dipanggil ({label})</p>
          {item ? (
            <div className="text-white text-center mt-2">
              <div className="text-9xl font-extrabold">{item.queue_number}</div>
              <div className="text-6xl font-extrabold truncate mt-2">
                {hideNameAction(item.patient_name)}
              </div>
              <div className="text-2xl font-extrabold truncate mt-2">
                {formatDateTime(item.waiting_pickup_medicine_stamp)}
              </div>
            </div>
          ) : (
            <div className="text-white text-center mt-2">-</div>
          )}
        </div>
      );
    };

    return (
      <div className={`p-4 flex-1 min-w-0 ${bgColor} rounded-lg shadow-md overflow-hidden`} style={{ minHeight: "1200px" }}>
        <p className="text-4xl font-extrabold text-white text-center uppercase">{title}</p>
        <div className="flex flex-col gap-4 mb-4 mt-2">
          {renderLastCalled('racik')}
          {renderLastCalled('nonracik')}
        </div>
      </div>
    );
  };

  const QueuePickupTerlewat = ({ title, queuesRacik, queuesNonRacik, bgColor }) => {
    const chunkArray = (arr, size) => {
      return arr.reduce((chunks, item, i) => {
        if (i % size === 0) {
          chunks.push([item]);
        } else {
          chunks[chunks.length - 1].push(item);
        }
        return chunks;
      }, []);
    };

    const chunkedRacik = useMemo(() => chunkArray(queuesRacik, 5), [queuesRacik]);
    const chunkedNonRacik = useMemo(() => chunkArray(queuesNonRacik, 5), [queuesNonRacik]);

    const renderQueueItem = (queue, isRacikan = true) => (
      <div
        key={`${queue.queueNumber}-${isRacikan ? "racik" : "nonracik"}`}
        className={`w-full uppercase bg-gray-100 p-4 shadow font-extrabold rounded mb-1 flex flex-col items-center justify-center text-center ${getStatusColourBorder(queue.status)}`}
        style={{ minHeight: "140px" }}
      >
        <div className="flex flex-col font-extrabold">
          <div className={`text-6xl ${getStatusColor(queue.status)}`}>
            {queue.queueNumber}
          </div>
        </div>
        <div className="text-center text-bold mt-2 w-[450px] bg-green-400 px-4 py-2 text-black text-3xl truncate whitespace-nowrap overflow-hidden leading-tight">
          { hideNameAction(queue.patient_name) }
        </div>
      </div>
    );

    const renderQueueList = (queues, isRacikan = true) => {
      if (!queues || queues.length === 0) {
        return (
          <div className="bg-gray-100 text-black p-2 shadow text-center font-bold text-2xl h-full flex items-center justify-center">
            Belum Ada Antrian
          </div>
        );
      }
      return queues.map((queue) => renderQueueItem(queue, isRacikan));
    };

    const renderQueueSection = (queues, chunked, duration, label, isRacikan = true) => (
      <div
        className="flex-1 min-w-[300px] bg-gray-100 p-2 rounded-md shadow-md"
        style={{ height: "1120px" }}
      >
        <p className="text-2xl font-extrabold text-center text-green-700 uppercase">
          {label}
        </p>
        <div className="bg-gray-100 rounded-md p-2">
          {queues.length > 5 ? (
            <SeamlessCarousel
              chunks={chunked}
              duration={duration}
              renderItem={(group) => renderQueueList(group, isRacikan)}
            />
          ) : (
            <div style={{ height: "1060px", overflowY: "auto" }}>
              {renderQueueList(queues, isRacikan)}
            </div>
          )}
        </div>
      </div>
    );

    return (
      <div
        className={`p-4 flex-1 min-w-0 ${bgColor} rounded-lg shadow-md`}
        style={{ minHeight: "1200px" }}
      >
        <p className="text-4xl font-extrabold text-white text-center uppercase">
          {title}
        </p>
        <div className="flex flex-wrap gap-2 mt-2 overflow-x-hidden">
          {renderQueueSection(
            queuesRacik,
            chunkedRacik,
            times.pickupTimeRacik,
            "Racikan",
            true
          )}
          {renderQueueSection(
            queuesNonRacik,
            chunkedNonRacik,
            times.pickupTimeNon,
            "Non-Racikan",
            false
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="bg-gray-100 p-4 shadow-lg border border-green-700 w-full" style={{ minHeight: "300px" }}>
      <div className="flex flex-wrap flex-row gap-2">
        <QueuePickup
          title="Obat Telah Selesai"
          queuesNonRacik={queues.pickupNonRacik}
          queuesRacik={queues.pickupRacik}
          bgColor="bg-green-700"
        />
        <QueuePickupTerlewat
          title="Panggilan Obat Terlewat"
          queuesRacik={queues.pickupTerlewatRacik}
          queuesNonRacik={queues.pickupTerlewatNonRacik}
          bgColor="bg-red-700"
        />
      </div>
    </div>
  );
};

export default NextQueue;