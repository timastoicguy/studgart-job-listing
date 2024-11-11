/* eslint-disable @typescript-eslint/no-unused-vars */
import React, { useState } from 'react';
import { Radio, Button, message, Table } from 'antd';
import type { RadioChangeEvent } from 'antd';
import { QRCodeCanvas } from 'qrcode.react'; // For using the canvas version

const PaymentForm = () => {
  const [selectedPaymentOption, setSelectedPaymentOption] = useState<'transfer' | 'momo'>('transfer');
  const [selectedAmount, setSelectedAmount] = useState<number | null>(null);
  const [accountBalance, setAccountBalance] = useState(250000); // Example account balance

  const ranks = [
    { name: 'Đồng', symbol: '🥉' },     // Rank đồng
    { name: 'Bạc', symbol: '🥈' },     // Rank bạc
    { name: 'Vàng', symbol: '🥇' },    // Rank vàng
    { name: 'Bạch kim', symbol: '🏆' }, // Rank bạch kim
    { name: 'Kim cương', symbol: '💎' } // Rank cao nhất
  ];

  const amounts = [10000, 20000, 100000, 200000, 500000]; // Đơn vị tiền

  const handlePaymentOptionChange = (e: RadioChangeEvent) => {
    setSelectedPaymentOption(e.target.value as 'transfer' | 'momo');
  };

  const handleAmountSelect = (amount: number) => {
    setSelectedAmount(amount);
  };

  const handleConfirmPayment = () => {
    if (selectedAmount === null) {
      message.error('Vui lòng chọn số tiền cần thanh toán.');
      return;
    }
    message.success('Thanh toán thành công!');
  };

  const qrData = `Payment Method: ${selectedPaymentOption}, Amount: ${selectedAmount ? `${selectedAmount / 1000}k` : 'N/A'}`;

  // Table data for price by rank
  const rankPriceColumns = [
    { title: 'Rank', dataIndex: 'rank', key: 'rank' },
    { title: 'Price (VND)', dataIndex: 'price', key: 'price' },
  ];

  const rankPrices = [
    { rank: 'Đồng', price: '20,000' },
    { rank: 'Bạc', price: '100,000' },
    { rank: 'Vàng', price: '200,000' },
    { rank: 'Bạch kim', price: '500,000' },
    { rank: 'Kim cương', price: '1,000,000' },
  ];

  return (
    <div className="min-h-screen flex justify-center items-center bg-gray-100">
      <div className="bg-white shadow-lg rounded-lg w-full max-w-md p-8 border border-green-500">
        <div className="bg-custom-gradient text-white p-4 rounded-t-md text-lg font-bold mb-4">
          Thanh toán
        </div>

        {/* Account balance */}
        <div className="mb-6">
          <label className="block font-medium mb-2 text-green-700">Số tiền hiện có trong tài khoản:</label>
          <div className="font-semibold text-xl text-green-800">{accountBalance.toLocaleString()} VND</div>
        </div>

        {/* Rank and Symbol */}
        <div className="mb-6">
          <label className="block font-medium mb-2 text-green-700">Rank của bạn:</label>
          <div className="flex flex-wrap gap-4">
            {ranks.map((rank, index) => (
              <div key={index} className="px-4 py-2 border border-green-300 rounded-md bg-green-50 text-center">
                <span className="text-xl">{rank.symbol}</span> <span className="font-semibold">{rank.name}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment Option */}
        <div className="mb-6">
          <label className="block font-medium mb-2 text-green-700">Chọn phương thức thanh toán:</label>
          <Radio.Group value={selectedPaymentOption} onChange={handlePaymentOptionChange}>
            <Radio.Button
              value="transfer"
              className={`${
                selectedPaymentOption === 'transfer' ? 'bg-green-900 text-white' : 'text-green-600'
              } hover:bg-green-500 border-green-600 focus:outline-none focus:ring-none`}
            >
              Chuyển khoản
            </Radio.Button>
            <Radio.Button
              value="momo"
              className={`${
                selectedPaymentOption === 'momo' ? 'bg-green-900 text-white' : 'text-green-600'
              } hover:bg-green-500 border-green-600 focus:outline-none focus:ring-none`}
            >
              Momo
            </Radio.Button>
          </Radio.Group>
        </div>

        {/* Amount Selection */}
        <div className="mb-6">
          <label className="block font-medium mb-2 text-green-700">Chọn số tiền thanh toán:</label>
          <div className="flex flex-wrap gap-2">
            {amounts.map((amount) => (
              <Button
                key={amount}
                type={selectedAmount === amount ? 'primary' : 'default'}
                className={`${
                  selectedAmount === amount ? 'bg-green-900' : ''
                } hover:bg-green-500`}
                onClick={() => handleAmountSelect(amount)}
              >
                {amount / 1000}k
              </Button>
            ))}
          </div>
        </div>

        {/* Price Table */}
        <div className="mb-6">
          <label className="block font-medium mb-2 text-green-700">Bảng giá theo rank:</label>
          <Table columns={rankPriceColumns} dataSource={rankPrices} pagination={false} />
        </div>

        {/* Confirm Payment and QR Code */}
        <div className="flex items-center gap-4">
          <Button
            type="primary"
            block
            onClick={handleConfirmPayment}
            className="bg-green-500 hover:bg-green-600 text-white"
          >
            Xác nhận thanh toán
          </Button>

          {/* QR Code Display */}
          {selectedAmount && (
            <div className="flex justify-center items-center">
              <QRCodeCanvas value={qrData} size={128} />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentForm;
