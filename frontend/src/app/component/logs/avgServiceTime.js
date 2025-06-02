import React from "react";
import { Column } from '@ant-design/plots';
import { Box, Paper, Typography } from "@mui/material";

const AvgServiceTime = ({ avgTime = {} }) => {
  // Safely transform the data with proper error handling
  const chartData = [
    {
      type: 'Racikan',
      time: convertToNumber(avgTime?.racikan?.time ?? avgTime?.racikan ?? 0),
      rawValue: avgTime?.racikan?.time ?? avgTime?.racikan // Keep original for debugging
    },
    {
      type: 'Non-Racikan',
      time: convertToNumber(avgTime?.nonracikan?.time ?? avgTime?.nonracikan ?? 0),
      rawValue: avgTime?.nonracikan?.time ?? avgTime?.nonracikan
    }
  ];

  // Helper function for reliable number conversion
  function convertToNumber(value) {
    if (typeof value === 'number') return value;
    if (typeof value === 'string') {
      const num = parseFloat(value.replace(',', '.'));
      return isNaN(num) ? 0 : num;
    }
    return 0;
  }


  const config = {
    data: chartData,
  xField: 'type',
  yField: 'time',
  seriesField: 'type',
  color: ['#1890ff', '#52c41a'],
  barStyle: {
    radius: [4, 4, 0, 0],
  },
  barWidthRatio: 0.5,
  minBarWidth: 10,
  maxBarWidth: 30,
  padding: 'auto',
  margin: 0,
  appendPadding: 20,
  xAxis: {
    tickCount: chartData.length,
    range: [0, 1]
  },
  style: {
    margin: '0 auto',
    display: 'block'
  },
    axis: {
      y: {
        label: {
          style: {
            fontSize: 12,
            fontWeight: 'bold',
            fill: '#000',
          },
        },
        title: {
          text: 'Average Time (minutes)',
          style: {
            fontSize: 16,
            fontWeight: 'bold',
            fill: '#000',
          },
        },
      },
      x: {
        label: {
          style: {
            fontSize: 14,
            fontWeight: 'bold',
            fill: '#000',
          },
        },
        title: {
          text: 'Medicine Type',
          style: {
            fontSize: 16,
            fontWeight: 'bold',
            fill: '#000',
          },
        },
      }
    },
    label: {
        position: 'top',
        formatter: (datum) => {
          // Debug output to console
          console.log('Label formatter datum:', {
            type: datum.type,
            time: datum.time,
            rawValue: datum.rawValue
          });
          
          return `${Math.round(datum.time)} mins`;
        },
        style: {
          fontSize: 12,
          fill: '#000',
          fontWeight: 'bold',
        },
      },
    tooltip: {
      formatter: (datum) => {
        return {
          name: datum.type,
          value:  `${Math.round(datum.time)} minutes`,
        };
      },
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
    <Box sx={{ p: 2, width:"600px" }}>
      <Paper elevation={3} sx={{ p: 2, minHeight: '500px' }}>
        <Typography variant="h6" gutterBottom>
          Average Processing Time by Medicine Type
        </Typography>
        {chartData.some(item => item.time > 0) ? (
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

export default AvgServiceTime;