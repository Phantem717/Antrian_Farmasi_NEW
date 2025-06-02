import React from "react";
import { Box, Paper } from "@mui/material";
import { Progress } from 'antd';

const MedicineTypeCard = ({ medicineType }) => {
    // console.log("COUNT",medicineType);
    // Safely handle medicineType data
    const racikanCount = medicineType?.[0]?.booking_count || 0;
    const nonRacikanCount = medicineType?.[1]?.booking_count || 0;
    const total = racikanCount + nonRacikanCount;
    const racikanPercent = total > 0 ? Math.round((racikanCount / total) * 100) : 0;

    return (
        <Box sx={{ padding: "10px", width:"300px" }}>
            <Paper elevation={3} sx={{ padding: "10px", maxHeight: "700px", overflow: "auto" }}>
                <Box >
                    <div className="text-center">
                        <Progress
                            type="dashboard"
                            percent={100}
                            strokeColor="#8884d8" // Racikan color
                            success={{
                                percent: racikanPercent,
                                strokeColor: "#82ca9d" // Non-racikan color
                            }}
                            size={150}
                            format={() => (
                                <div className="flex flex-col">
                                    <span className="font-bold">{total}</span>
                                    <span className="text-xs">Total Medications</span>
                                </div>
                            )}
                        />
                        <div className="flex justify-center gap-4 mt-4">
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-[#8884d8] mr-2 rounded-full"></div>
                                <span>Racikan: {racikanCount}</span>
                            </div>
                            <div className="flex items-center">
                                <div className="w-3 h-3 bg-[#82ca9d] mr-2 rounded-full"></div>
                                <span>Non-Racikan: {nonRacikanCount}</span>
                            </div>
                        </div>
                    </div>
                </Box>
            </Paper>
        </Box>
    );
};

export default MedicineTypeCard;