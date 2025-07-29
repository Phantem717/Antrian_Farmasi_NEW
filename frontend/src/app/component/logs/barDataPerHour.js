import React, {useState, useEffect} from "react";
import { Column } from '@ant-design/plots';
import { Box, Paper, Typography } from "@mui/material";
import LogsAPI from "@/app/utils/api/Logs";
const BardataPerHour = ({isSubmit,setIsSubmit,fromDate,toDate,location}) => {
  const [dataPerHour,setdataPerHour] = useState([]);
      
      useEffect(() => {
      const fetchList = async() => {
  
          try {
      if(fromDate && toDate){
                  console.log("BAR DATA AVG TRU");

        const response = await LogsAPI.getDataPerHourByDate(fromDate,toDate,location);
        setdataPerHour(response.data);
      }else{
                  console.log("SUBMIT DATA FALSE");

  const response = await LogsAPI.getDataPerHour(location);
      setdataPerHour(response.data);
      }
    
              setIsSubmit(false);

      console.log("BAR DATA PER HOUR",dataPerHour);
      }
      catch (err) {
          setError(err.message || "Failed to load data");
          message.error("Failed to load logs data");
        } finally {
        }
      }
      fetchList();
      },[])
  const fullHourData = Array.from({ length: 24 }, (_, hour) => {
    const found = dataPerHour.find(item => Number(item.hour_of_day) === hour);
    return {
      hour_of_day: `${hour}:00`,
      record_count: found ? found.record_count : 0,
      type: 'Prescriptions',
    };
  });

  const config = {
    data: fullHourData,
    xField: 'hour_of_day',
    yField: 'record_count',
    barStyle: {
      radius: [4, 4, 0, 0],
    },
    barWidthRatio: 0.5,
    minBarWidth: 10,
    maxBarWidth: 30,
    axis: {
y:{
    label: {
        style: {
          fontSize: 30, // Increased Y-axis label size
          fontWeight: 'bold',
          fill: '#000',
        },
      },
      title: {
        text: 'Prescriptions',
        style: {
          fontSize: 16, // Y-axis title size
          fontWeight: 'bold',
          fill: '#000',
        },
      },
},
x:{
    label: {
        autoHide: true,
        autoRotate: false,
        style: {
          fontSize: 14, // Increased X-axis label size
          fontWeight: 'bold',
          fill: '#000',
        },
        formatter: (val) => val.replace(':00', 'h') // Format as "8h", "14h" etc.
      },
      title: {
        text: 'Hour of Day',
        style: {
          fontSize: 16, // X-axis title size
          fontWeight: 'bold',
          fill: '#000',
        },
      },
}
    },
   
   
    label: {
      position: 'top',
      style: {
        fontSize: 12,
        fill: '#000',
        fontWeight: 'bold',
      },
    },
    tooltip: {
      showMarkers: false,
      domStyles: {
        'g2-tooltip-title': {
          fontSize: '16px',
        },
        'g2-tooltip-list-item': {
          fontSize: '14px',
        },
      },
    },
  };

  return (
    <Box sx={{ p: 2 }}>
      <Paper elevation={3} sx={{ p: 2, minHeight: '400px' }}>
        {dataPerHour.length > 0 ? (
          <Column {...config} />
        ) : (
          <Typography variant="body1" align="center" sx={{ mt: 4 }}>
            No prescription data available
          </Typography>
        )}
      </Paper>
    </Box>
  );
};

export default BardataPerHour;