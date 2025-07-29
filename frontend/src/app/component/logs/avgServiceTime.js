import React, { useEffect, useState } from "react";
import { Column } from '@ant-design/plots';
import { Box, Paper, Typography } from "@mui/material";
import LogsAPI from "@/app/utils/api/Logs";

const AvgServiceTime = ({isSubmit, setIsSubmit, fromDate, toDate, location}) => {
  const [avgTime, setAvgTime] = useState({
    racikan: { time: 0, type: 'Racikan' },
    nonracikan: { time: 0, type: 'Non - Racikan' }
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = fromDate && toDate
          ? await LogsAPI.getAvgServiceTimeByDate(fromDate, toDate, location)
          : await LogsAPI.getAvgServiceTime(location);
        
        setAvgTime({
          racikan: {
            time: response.data[0]['AVG PROCESSING TIME - RACIKAN (MINUTES)'],
            type: 'Racikan'
          },
          nonracikan: {
            time: response.data[0]['AVG PROCESSING TIME - NON-RACIKAN (MINUTES)'],
            type: 'Non - Racikan'
          }
        });
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
        setIsSubmit(false);
      }
    };
    
    fetchData();
  }, [isSubmit, fromDate, toDate, location, setIsSubmit]);

  const chartData = [
    {
      type: 'Racikan',
      time: Number(avgTime.racikan.time) || 0
    },
    {
      type: 'Non-Racikan',
      time: Number(avgTime.nonracikan.time) || 0
    }
  ];

  const config = {
    data: chartData,
    xField: 'type',
    yField: 'time',
    seriesField: 'type',
    color: ['#1890ff', '#52c41a'],
    barStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: 'top',
      formatter: (data) => `${Math.round(data.time)} mins`,
      style: {
        fontSize: 12,
        fill: '#000',
        fontWeight: 'bold',
      },
    },
    yAxis: {
      min: 0,
      title: {
        text: 'Minutes',
        style: {
          fontSize: 14,
        },
      },
    },
    tooltip: {
      showTitle: true,
      formatter: (data) => ({
        name: data.type,
        value: `${data.time.toFixed(1)} minutes`
      }),
    },
  };

  return (
    <Box sx={{ p: 2, width: "600px" }}>
      <Paper elevation={3} sx={{ p: 2, minHeight: '400px' }}>
        <Typography variant="h6" gutterBottom>
          Average Processing Time
        </Typography>
        {loading ? (
          <Typography>Loading...</Typography>
        ) : chartData.some(item => item.time > 0) ? (
          <Column {...config} />
        ) : (
          <Typography variant="body1" align="center" sx={{ mt: 4 }}>
            Data not available
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default AvgServiceTime;