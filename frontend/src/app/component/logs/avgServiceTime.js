import React, { useEffect, useState } from "react";
import { Column } from '@ant-design/plots';
import { Box, Paper, Typography } from "@mui/material";
import LogsAPI from "@/app/utils/api/Logs";

const AvgServiceTime = () => {
  const [avgTime, setAvgTime] = useState([]);
  
  useEffect(() => {
    const fetchList = async () => {
      try {
        // Make sure to call the function with parentheses
        const response = await LogsAPI.getAvgServiceTime(); 
        console.log("SERVICE TIME",response);
         const payload ={
       racikan : {
        time: response.data[0]['AVG PROCESSING TIME - RACIKAN (MINUTES)'],
        type: 'Racikan'
       },
       nonracikan : {
 time: response.data[0]['AVG PROCESSING TIME - NON-RACIKAN (MINUTES)'],
        type: 'Non - Racikan'
       }
      }
        setAvgTime(payload);
      } catch (err) {
        console.error("Error fetching average service time:", err);
      }
    };
    
    fetchList();
  }, []);

  // Improved data conversion and fallback
  const convertToNumber = (value) => {
    if (value === null || value === undefined) return 0;
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      // Handle different number formats
      const num = parseFloat(value.replace(',', '.').replace(/[^0-9.-]/g, ''));
      return isNaN(num) ? 0 : num;
    }
    return 0;
  };

  // Safely prepare chart data
  const chartData = [
    {
      type: 'Racikan',
      time: convertToNumber(avgTime?.racik?.time ?? avgTime?.racikan?.time ?? avgTime?.racikan ?? 0),
    },
    {
      type: 'Non-Racikan',
      time: convertToNumber(avgTime?.nonracik?.time ?? avgTime?.nonracikan?.time ?? avgTime?.nonracikan ?? 0),
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
      formatter: (datum) => `${Math.round(datum.time)} mins`,
      style: {
        fontSize: 12,
        fill: '#000',
        fontWeight: 'bold',
      },
    },
    yAxis: {
      min: 0, // Ensure chart starts at 0
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
          value: `${datum.time.toFixed(1)} minutes`,
        };
      },
    },
  };
  console.log("AVG TIME",avgTime)

  return (
    <Box sx={{ p: 2, width: "600px" }}>
      <Paper elevation={3} sx={{ p: 2, minHeight: '400px' }}>
        <Typography variant="h6" gutterBottom>
          Average Processing Time
        </Typography>
        {chartData.some(item => item.time > 0) ? (
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