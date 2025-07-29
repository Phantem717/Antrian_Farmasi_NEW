import React, { useEffect, useState } from "react";
import { Column } from '@ant-design/plots';
import { Box, Paper, Typography } from "@mui/material";
import LogsAPI from "@/app/utils/api/Logs";

const AvgServiceTime = ({ isSubmit, setIsSubmit, fromDate, toDate, location }) => {
  const [avgTime, setAvgTime] = useState({
    racikan: 0,
    nonracikan: 0
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchList = async () => {
      setLoading(true);
      try {
        let response;
        if (fromDate && toDate) {
          console.log("Fetching with date range");
          response = await LogsAPI.getAvgServiceTimeByDate(fromDate, toDate, location);
        } else {
          console.log("Fetching without date range");
          response = await LogsAPI.getAvgServiceTime(location);
        }

        console.log("SERVICE TIME RESPONSE", response);
        
        // Handle both possible response structures
        const data = response.data[0] || response.data;
        const payload = {
          racikan: convertToNumber(data['AVG PROCESSING TIME - RACIKAN (MINUTES)']),
          nonracikan: convertToNumber(data['AVG PROCESSING TIME - NON-RACIKAN (MINUTES)'])
        };
        
        setAvgTime(payload);
        setIsSubmit(false);
      } catch (err) {
        console.error("Error fetching average service time:", err);
        setAvgTime({ racikan: 0, nonracikan: 0 });
      } finally {
        setLoading(false);
      }
    };
    
    fetchList();
  }, [isSubmit, fromDate, toDate, location, setIsSubmit]);

  const convertToNumber = (value) => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Remove any formatting and convert
      const num = parseFloat(value.replace(/[^\d.-]/g, ''));
      return isNaN(num) ? 0 : Math.round(num);
    }
    return 0;
  };

  const chartData = [
    {
      type: 'Racikan',
      time: avgTime.racikan
    },
    {
      type: 'Non-Racikan',
      time: avgTime.nonracikan
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
      formatter: (datum) => {
        return `${datum.time} mins`;
      },
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
      formatter: (datum) => {
        return {
          name: datum.type,
          value: `${datum.time} minutes`,
        };
      },
    },
  };

  return (
    <Box sx={{ p: 2, width: "600px" }}>
      <Paper elevation={3} sx={{ p: 2, minHeight: '400px' }}>
        <Typography variant="h6" gutterBottom>
          Average Processing Time
        </Typography>
        {loading ? (
          <Typography variant="body1" align="center" sx={{ mt: 4 }}>
            Loading data...
          </Typography>
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