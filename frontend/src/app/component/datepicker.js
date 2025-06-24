// src/components/DatePicker.js
"use client";
import { useState, useEffect, forwardRef } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import Image from "next/image";

export default function CustomDatePicker({ date, setDate, selectedStatus }) {
  const [selectedDate, setSelectedDate] = useState(date ? new Date(date).setHours(7, 0, 0, 0) :  new Date().setHours(7,0,0,0,0));
  console.log("DATEPCIKER",date,selectedDate);
  useEffect(() => {
    if (date) {
      setSelectedDate(new Date(date).setHours(7, 0, 0, 0));
    } else {
      setSelectedDate(null);
    }
  }, [date]);

  const CustomInput = forwardRef(({ value, onClick }, ref) => (
    <div className="relative w-full">
      <input
        type="text"
        className="w-full border border-gray-300 rounded px-2 py-2 pr-10 text-base focus:outline-none focus:ring-2 focus:ring-blue-500"
        value={value || "Pilih tanggal"}
        onClick={onClick}
        ref={ref}
        readOnly
      />
      <Image
        src="/images/calendar.png"
        width={20}
        height={20}
        alt="Calendar Icon"
        className="absolute right-2 top-1/2 transform -translate-y-1/2 cursor-pointer"
        onClick={onClick}
      />
    </div>
  ));

  return (
    <div className="w-full z-50">
      <DatePicker
        selected={selectedDate}
        disabled={!selectedStatus}
        onChange={(date) => {
          setSelectedDate(date);
  const formattedDate = date ? 
            `${date.getFullYear()}-${(date.getMonth()+1).toString().padStart(2,'0')}-${date.getDate().toString().padStart(2,'0')}` : 
            null;
          setDate(formattedDate);        }}
        dateFormat="dd/MM/yyyy"
        customInput={<CustomInput />}
        isClearable
        placeholderText="Pilih tanggal"
        showYearDropdown
        scrollableYearDropdown
        yearDropdownItemNumber={50}
        maxDate={new Date()}
      />
    </div>
  );
}