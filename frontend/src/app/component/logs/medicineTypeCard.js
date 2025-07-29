import React, { useEffect,useState } from "react";
import { Box, Paper } from "@mui/material";
import { Progress } from 'antd';
import { Pie } from '@ant-design/plots';
import LogsAPI from "@/app/utils/api/Logs";
const MedicineTypeCard = ({isSubmit,setIsSubmit,fromDate,toDate,location}) => {
    // Safely handle medicineType data
    const [medicineType,setMedicineType] = useState([]);
    
    useEffect(() => {
    const fetchList = async() => {

        try {
          if(fromDate && toDate){
                      console.log("SUBMIT MED TRU");

            const response = await LogsAPI.getTotalMedicineTypeByDate(fromDate,toDate,location);
            setMedicineType(response.data);
          }
          else{
          const response = await LogsAPI.getMedicineType(location);
          setMedicineType(response.data);
          }
              console.log("COUNT",medicineType);
              setIsSubmit(false);
    }
    catch (err) {
        console.error(err.message || "Failed to load data");
      } finally {
      }
    }
    fetchList();
    },[])
    
    const racikanCount = medicineType?.[1]?.booking_count || 0;
    const nonRacikanCount = medicineType?.[0]?.booking_count || 0;
    const total = racikanCount + nonRacikanCount;
    const config = {
        data: [
        {type: 'Racikan', value: racikanCount},
        {type: 'Non - Racikan', value: nonRacikanCount}
        ],
        angleField: 'value',
    colorField: 'type',
    innerRadius: 0.6,
    label: {
      text: 'value',
      style: {
        fontWeight: 'bold',
        fontSize:40,
        color: 'black'
      },
    },
    legend: {
      color: {
        title: false,
        position: 'right',
        layout: 'vertical',
        rowPadding: 5,
      },
    },
    annotations: [
      {
        type: 'text',
        style: {
          text: 'Total Medications',
          x: '50%',
          y: '55%',
          textAlign: 'center',
          fontSize: 20,
          fontStyle: 'bold',
          
        },
        
      },
      {
        type: 'text',
        style: {
             text: `${total}`,
          x: '50%',
          y: '45%',
          textAlign: 'center',
          fontSize: 70,
          fontStyle: 'bold',
        }
      }
      
    ],
       
    }
    return (
        <Box sx={{ padding: "10px", width:"1000px" }}>
            <Paper elevation={3} sx={{ padding: "10px", maxHeight: "1000px", overflow: "auto" }}>
                <Box >
                    <div className="text-center">
                        <div className="text-4xl font-bold mb-2 uppercase">
                            Total Medications
                        </div>
                        <div className="flex justify-center w-full">
                        <Pie {...config}/>

                        </div>
                        {/* <div className="flex justify-center gap-4 ">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-[#8884d8] mr-2 rounded-full "></div>
                                <span className="text-2xl font-bold uppercase">Racikan: {racikanCount}</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-[#82ca9d] mr-2 rounded-full"></div>
                                <span className="text-2xl font-bold uppercase">Non-Racikan: {nonRacikanCount}</span>
                            </div>
                        </div> */}
                    </div>
                </Box>
            </Paper>
        </Box>
    );
};

export default MedicineTypeCard;