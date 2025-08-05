'use client'
import QueueCall from '@/app/component/display/bpjs/QueueCall_b';
import ServingQueue from '@/app/component/display/bpjs/ServingQueue_b';
import MissQueue from '@/app/component/display/bpjs/MissQueue_b';
import NextQueue from '@/app/component/display/bpjs/NextQueue_miss';
import InfoBar from '@/app/component/display/bpjs/InfoBar_b';
import MarqueeFooter from '@/app/component/display/bpjs/MarqueeFooter_b';
import React, { useState,useEffect } from "react";
import {getSocket} from "@/app/utils/api/socket";
import responses from "@/app/utils/api/responses";
import { getReactRender } from 'antd/es/config-provider/UnstableContext';
import { use } from 'react'; // Next.js 14+


export default function BPJS_Pickup_Miss({params}) {
  const {category} = use(params);
  console.log(category);

    return (
      <div className="bg-gray-300 h-screen min-w-screen flex flex-col">
        {/* Header and content - use flex-1 to allow footer space */}
        <div className="flex-1 overflow-auto p-4">
          <InfoBar location={category}/>
          <div className="flex flex-row gap-4 mb-4 h-[calc(100%-3rem)]">
            <NextQueue location={category} />
            <QueueCall location={category} />
          </div>
        </div>
        
        {/* Footer - will stick to bottom */}
        <div className="w-full">
          <MarqueeFooter />
        </div>
      </div>
    );
}