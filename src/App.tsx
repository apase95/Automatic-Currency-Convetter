import { useState, useEffect } from 'react';

function App() {
  const [amount, setAmount] = useState<string>('');
  const [currency, setCurrency] = useState('USD');
  const [customRate, setCustomRate] = useState<number>(0);
  const [result, setResult] = useState<string>('0');
  const [loading, setLoading] = useState(false);

  const currencies = [
    { code: 'USD', name: 'Đô la Mỹ', flag: '🇺🇸' },
    { code: 'SGD', name: 'Đô la Singapore', flag: '🇸🇬' },
    { code: 'EUR', name: 'Euro', flag: '🇪🇺' },
    { code: 'JPY', name: 'Yên Nhật', flag: '🇯🇵' },
    { code: 'CNY', name: 'Nhân dân tệ', flag: '🇨🇳' },
    { code: 'GBP', name: 'Bảng Anh', flag: '🇬🇧' },
    { code: 'KRW', name: 'Won Hàn', flag: '🇰🇷' },
    { code: 'AUD', name: 'Đô la Úc', flag: '🇦🇺' },
  ];

  useEffect(() => {
    const fetchRate = async () => {
      setLoading(true);
      try {
        const response = await fetch(`https://api.exchangerate-api.com/v4/latest/${currency}`);
        const data = await response.json();
        const vndRate = data.rates['VND'];
        setCustomRate(vndRate);
      } catch (error) {
        console.error("Lỗi lấy tỷ giá:", error);
        if (currency === 'USD') setCustomRate(25450);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, [currency]);

  useEffect(() => {
    const val = parseFloat(amount);
    if (!isNaN(val) && customRate > 0) {
      const converted = val * customRate;
      setResult(new Intl.NumberFormat('vi-VN').format(converted));
    } else {
      setResult('0');
    }
  }, [amount, customRate]);

  return (
    <div className="w-full bg-neutral-950/95 font-sans shadow-lg">
      <div className="bg-blue-950/60 p-4 text-blue-100 flex justify-between items-center rounded-b-2xl shadow-md">
        <h1 className="text-lg font-bold flex items-center gap-2">
          Currency Converter
        </h1>
        <span className="text-xs bg-blue-900/80 px-2 py-1 rounded text-blue-100">
          1 {currency} ≈ {new Intl.NumberFormat('vi-VN').format(customRate)} đ
        </span>
      </div>

      <div className="p-5 flex flex-col gap-6">
        <div>
          <label className="block text-xs font-semibold text-blue-100 uppercase mb-1">
            Amount of Money to Exchange
          </label>
          <div className="flex gap-2">
            <input 
              type="number" 
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              placeholder="Amount..."
              className="flex-1 px-3 py-1 text-lg border-2 border-blue-200 rounded-xl focus:border-blue-400 focus:outline-none font-bold text-blue-100
                [color-scheme:dark]
                [&::-webkit-inner-spin-button]:opacity-100
                [&::-webkit-inner-spin-button]:h-8
                [&::-webkit-inner-spin-button]:cursor-pointer
              "
              autoFocus
            />
            
            <select 
              value={currency} 
              onChange={(e) => setCurrency(e.target.value)}
              className="p-1 text-blue-100 border-2 border-blue-200 rounded-xl font-semibold cursor-pointer hover:border-blue-400 focus:outline-none"
            >
              {currencies.map((c) => (
                <option className='text-black' key={c.code} value={c.code}>
                  {c.flag}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="px-4 py-2 rounded-xl border border-blue-200 text-center">
          <label className="block text-xs font-semibold text-blue-100 uppercase mb-1">Amount in VND</label>
          {loading ? (
             <span className="text-gray-400 text-sm">Updating Exchange Rate...</span>
          ) : (
            <div className="break-words text-3xl font-black text-blue-100">
              {result}<span className="text-lg font-medium text-blue-100">đ</span>
            </div>
          )}
        </div>
        
        <details className="text-xs text-blue-100 cursor-pointer">
          <summary className="hover:text-blue-300">Manual Exchange Rate Adjustment</summary>
          <div className="mt-2 flex items-center gap-2">
            <span>1 {currency} = </span>
            <input 
              type="number" 
              value={customRate}
              onChange={(e) => setCustomRate(Number(e.target.value))}
              className="border border-gray-300 rounded-md px-2 py-1 w-20 text-blue-100"
            />
            <span>VND</span>
          </div>
        </details>
      </div>
    </div>
  );
}

export default App;