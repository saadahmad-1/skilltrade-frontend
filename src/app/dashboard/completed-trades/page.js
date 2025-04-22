"use client";

import { useSelector } from 'react-redux';
import { selectUser, selectLoading } from '@/redux/features/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Spin } from 'antd';
import { CheckCircleIcon, ArrowLeftIcon, DownloadIcon } from 'lucide-react';
import jsPDF from 'jspdf';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export default function CompletedTrades() {
  const user = useSelector(selectUser);
  const loading = useSelector(selectLoading);
  const router = useRouter();
  const [completedTrades, setCompletedTrades] = useState([]);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/sign-in');
    }
  }, [user, loading, router]);

  // Fetch completed trades
  useEffect(() => {
    if (user) {
      fetch(`${API_URL}/api/trade/completed/${user.uid}`)
        .then(res => res.json())
        .then(async (data) => {
          console.log("Raw trades data:", data);
          
          // Create a Map to store unique trades using a composite key of skills
          const uniqueTradesMap = new Map();
          
          for (const trade of data) {
            // Create a unique key based on the skills being exchanged
            const skillKey = [trade.haveSkill._id, trade.wantSkill._id].sort().join('-');
            
            if (!uniqueTradesMap.has(skillKey)) {
              console.log("Processing trade:", trade._id);
              const userInfo = await fetch(`${API_URL}/api/user/${trade?.user === user.uid ? trade?.acceptedBy : trade?.user}`).then(res => res.json());
              uniqueTradesMap.set(skillKey, {
                ...trade,
                tradingPartner: userInfo?.fullName
              });
            } else {
              console.log("Skipping duplicate trade:", trade._id);
            }
          }
          
          const uniqueTrades = Array.from(uniqueTradesMap.values());
          console.log("Final unique trades:", uniqueTrades);
          setCompletedTrades(uniqueTrades);
        })
        .catch(err => console.error("Error fetching completed trades:", err));
    }
  }, [user]);

  // Function to generate and download certificate
  const downloadCertificate = (trade) => {
    const doc = new jsPDF({
      orientation: 'landscape',
      unit: 'mm',
      format: 'a4'
    });
    
    // Set background color
    doc.setFillColor(28, 28, 36);
    doc.rect(0, 0, doc.internal.pageSize.getWidth(), doc.internal.pageSize.getHeight(), 'F');
    
    // Add decorative border
    doc.setDrawColor(59, 130, 246); // Blue border
    doc.setLineWidth(3);
    doc.rect(10, 10, doc.internal.pageSize.getWidth() - 20, doc.internal.pageSize.getHeight() - 20, 'S');
    
    // Add inner border
    doc.setDrawColor(107, 114, 128); // Gray inner border
    doc.setLineWidth(0.5);
    doc.rect(15, 15, doc.internal.pageSize.getWidth() - 30, doc.internal.pageSize.getHeight() - 30, 'S');
    
    // Set text color
    doc.setTextColor(255, 255, 255);
    
    // Add heading
    doc.setFontSize(30);
    doc.setFont('helvetica', 'bold');
    doc.text('Certificate of Skill Exchange', doc.internal.pageSize.getWidth() / 2, 40, { align: 'center' });
    
    // Add certificate text
    doc.setFontSize(16);
    doc.setFont('helvetica', 'normal');
    
    const completionDate = new Date(trade.createdAt).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
    
    // Calculate which skill was taught/learned based on the user ID
    const taughtSkill = trade.user === user.uid ? trade.haveSkill.name : trade.wantSkill.name;
    const learnedSkill = trade.user === user.uid ? trade.wantSkill.name : trade.haveSkill.name;
    
    const certificateText = [
      `This is to certify that`,
      `${user.displayName || 'User'}`,
      `has successfully participated in a skill exchange with`,
      `${trade.tradingPartner}`,
      ``,
      `Skill Taught: ${taughtSkill}`,
      `Skill Learned: ${learnedSkill}`,
      ``,
      `Completed on ${completionDate}`
    ];
    
    // Add certificate text lines
    let y = 70;
    certificateText.forEach(line => {
      if (line === `${user.displayName || 'User'}` || line === `${trade.tradingPartner}`) {
        doc.setFont('helvetica', 'bold');
        doc.setFontSize(20);
        y += 12;
        doc.text(line, doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
        doc.setFont('helvetica', 'normal');
        doc.setFontSize(16);
      } else {
        y += 10;
        doc.text(line, doc.internal.pageSize.getWidth() / 2, y, { align: 'center' });
      }
    });
    
    // Add signature line
    y += 30;
    const lineWidth = 80;
    const lineX = (doc.internal.pageSize.getWidth() - lineWidth) / 2;
    doc.setLineWidth(0.5);
    doc.line(lineX, y, lineX + lineWidth, y);
    
    doc.setFontSize(12);
    doc.text('SkillTrade Platform', doc.internal.pageSize.getWidth() / 2, y + 10, { align: 'center' });
    
    // Add QR code placeholder or logo (simplified)
    doc.setFillColor(59, 130, 246);
    doc.circle(doc.internal.pageSize.getWidth() - 30, 30, 10, 'F');
    
    // Save the PDF
    const fileName = `SkillTrade_Certificate_${taughtSkill}_${learnedSkill}_${completionDate.replace(/,\s/g, '_')}.pdf`;
    doc.save(fileName);
  };

  if (loading) return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <Spin size="large" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-black text-white flex flex-col justify-center items-center px-4">
      <main className="w-full max-w-2xl">
        <div className="bg-gray-900 rounded-2xl p-8 w-full shadow-2xl border border-gray-800">
          <div className="flex items-center mb-6">
            <button
              onClick={() => router.push('/dashboard')}
              className="flex items-center text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeftIcon className="w-5 h-5 mr-2" />
              Back to Dashboard
            </button>
          </div>

          <div className="text-center mb-8">
            <div className="mb-6 flex justify-center">
              <CheckCircleIcon className="w-16 h-16 text-green-500" />
            </div>
            <h1 className="text-3xl font-bold mb-4">Completed Trades</h1>
            <p className="text-gray-400">
              View your history of successful skill exchanges
            </p>
          </div>

          {completedTrades.length > 0 ? (
            <div className="grid grid-cols-1 gap-6">
              {completedTrades.map((trade) => (
                <div
                  key={trade._id}
                  className="bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-700"
                >
                  <h2 className="text-2xl font-semibold mb-3 text-green-400">
                    Trade with {trade.tradingPartner}
                  </h2>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-300 mb-2">
                        {trade.user === user.uid ? "You Taught" : "You Learned"}
                      </h3>
                      <p className="text-white">{trade.haveSkill.name}</p>
                    </div>
                    <div className="bg-gray-700 p-4 rounded-lg">
                      <h3 className="text-lg font-semibold text-gray-300 mb-2">
                        {trade.user === user.uid ? "You Learned" : "You Taught"}
                      </h3>
                      <p className="text-white">{trade.wantSkill.name}</p>
                    </div>
                  </div>
                  <div className="flex justify-between items-center mt-4">
                    <div className="text-sm text-gray-400">
                      Completed on: {new Date(trade.createdAt).toLocaleDateString()}
                    </div>
                    <button
                      onClick={() => downloadCertificate(trade)}
                      className="flex items-center bg-blue-600 hover:bg-blue-500 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
                    >
                      <DownloadIcon className="w-4 h-4 mr-2" />
                      Download Certificate
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-400">No completed trades yet.</p>
              <button
                onClick={() => router.push('/dashboard')}
                className="mt-4 bg-blue-600 hover:bg-blue-500 text-white px-6 py-3 rounded-full text-lg font-semibold"
              >
                Start Trading
              </button>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}