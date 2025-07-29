import React, { useEffect, useState } from "react";
import { Column } from '@ant-design/plots';
import { Box, Paper, Typography } from "@mui/material";
import LogsAPI from "@/app/utils/api/Logs";

const AvgServiceTime = ({isSubmit, setIsSubmit, fromDate, toDate, location}) => {
  const [avgTime, setAvgTime] = useState({
    racikan: 0,
    nonracikan: 0
  });
  
  useEffect(() => {
    const fetchList = async () => {
      try {
        if(fromDate && toDate){
          const response = await LogsAPI.getAvgServiceTimeByDate(fromDate, toDate, location); 
          setAvgTime({
            racikan: response.data[0]['AVG PROCESSING TIME - RACIKAN (MINUTES)'],
            nonracikan: response.data[0]['AVG PROCESSING TIME - NON-RACIKAN (MINUTES)']
          });
        } else {
          const response = await LogsAPI.getAvgServiceTime(location);
          setAvgTime({
            racikan: response.data[0]['AVG PROCESSING TIME - RACIKAN (MINUTES)'],
            nonracikan: response.data[0]['AVG PROCESSING TIME - NON-RACIKAN (MINUTES)']
          });
          setIsSubmit(false);
        }
      } catch (err) {
        console.error("Error fetching data:", err);
      } finally {
        setLoading(false);
        setIsSubmit(false);
      }
    };
    
    fetchList();
  }, [isSubmit, fromDate, toDate, location, setIsSubmit]);

  // Convert to numbers safely
  const racikanTime = Math.round(parseFloat(avgTime.racikan)) ;
  const nonracikanTime =Math.round(parseFloat(avgTime.nonracikan)) ;
  console.log(racikanTime, nonracikanTime);
  const chartData = [
    { type: 'Racikan', value: racikanTime },
    { type: 'Non-Racikan', value: nonracikanTime }
  ];

  const config = {
    data: chartData,
    xField: 'type',
    yField: 'value',  // Changed from 'time' to 'value'
    seriesField: 'type',
    color: ['#1890ff', '#52c41a'],
    barStyle: {
      radius: [4, 4, 0, 0],
    },
    label: {
      position: 'top',
      formatter: (datum) => `${Math.round(datum)} mins`,  // Changed to datum.value
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
     formatter: (data) => {
    console.log("Tooltip Data:", data); // Debug actual structure
    return {
      name: data.type,
      value: `${(data.value || 0).toFixed(1)} minutes`,
    };
  },
  };

  return (
    <Box sx={{ p: 2, width: "600px" }}>
      <Paper elevation={3} sx={{ p: 2, minHeight: '400px' }}>
        <Typography variant="h6" gutterBottom>
          Average Processing Time
        </Typography>
        {chartData.some(item => item.value > 0) ? (
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