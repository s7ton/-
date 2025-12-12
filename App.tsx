import React, { useState, useEffect } from 'react';
import { 
  ProfileIcon, 
  CarIcon, 
  MapIcon, 
  FingerprintIcon, 
  BillIcon, 
  BoxIcon, 
  GunIcon,
  HomeIcon,
  ServicesIcon,
  MenuIcon
} from './components/Icons';
import { DocumentItem } from './types';

function useSmartMode() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(null);

  useEffect(() => {
    
    fetch("http://127.0.0.1:5000/get_data")
      .then(res => res.json())
      .then(data => {
        console.log("Loaded data from backend:", data);
        setLocation(data.location);
        setServices(data.sorted_services || []);
        setLoading(false);
      })
      .catch(err => {
        console.error("Error loading data:", err);
        setLoading(false);
      });
  }, []);

  return { services, loading, location };
}


const user = {
  name: "علي هاشم يوسف الفردان",
  id: "1023456780"
};

const documents: DocumentItem[] = [
  { id: '1', title: 'هوية مواطن', gradient: 'linear-gradient(90deg, #007D53 0%, #004D35 100%)' },
  { id: '2', title: 'جواز السفر', gradient: 'linear-gradient(90deg, #7F8C8D 0%, #546E7A 100%)' },
  { id: '3', title: 'رخصة قيادة', gradient: 'linear-gradient(90deg, #42A5F5 0%, #1E88E5 100%)' },
];

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const { services, loading, location } = useSmartMode();
  const [showSettings, setShowSettings] = useState(false);
  const [userLocation, setUserLocation] = useState<{ lat: number; lng: number }>({ lat: 24.7136, lng: 46.6753 });
  const [weaponsVisits, setWeaponsVisits] = useState(0);
  const [travelVisits, setTravelVisits] = useState(0);
  const [idExpiry, setIdExpiry] = useState("2025-02-01");
  const [platesAuctionVisits, setPlatesAuctionVisits] = useState(0);
  const [hasWeapons, setHasWeapons] = useState(false);

  
  useEffect(() => {
    if (location) setUserLocation(location);
  }, [location]);

  
  useEffect(() => {
    fetch("http://127.0.0.1:5000/get_data")
      .then(res => res.json())
      .then(data => {
        setUserLocation(data.location || { lat: 24.7136, lng: 46.6753 });
        setIdExpiry(data.documents?.id_expiry || "2025-02-01");
        setWeaponsVisits(data.visits?.weapons || 0);
        setPlatesAuctionVisits(data.visits?.plates_auction || 0);
        setHasWeapons((data.visits?.weapons || 0) > 0);
      })
      .catch(err => console.error("Error loading data:", err));
  }, []);

 
  const saveCustomData = () => {
    fetch("http://127.0.0.1:5000/update_location", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        lat: parseFloat(userLocation.lat.toString()),
        lng: parseFloat(userLocation.lng.toString()),
      }),
    })
    .then(res => res.json())
    .then(data => {
      console.log("Location updated:", data);
      setTimeout(() => window.location.reload(), 800);
    })
    .catch(err => console.error("Error:", err));
  };

  
  const updateVisits = (service: string, count: number) => {
    fetch("http://127.0.0.1:5000/log_visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service, count }),
    })
    .then(res => res.json())
    .then(data => {
      console.log("Visit updated:", data);
      setTimeout(() => window.location.reload(), 800);
    })
    .catch(err => console.error("Error:", err));
  };


  const updateIdExpiry = () => {
    fetch("http://127.0.0.1:5000/update_documents", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id_expiry: idExpiry }),
    })
    .then(res => res.json())
    .then(data => {
      console.log("ID Expiry updated:", data);
      setTimeout(() => window.location.reload(), 800);
    })
    .catch(err => console.error("Error:", err));
  };

  const getServiceOrder = (serviceId: string): number => {
    const service = services.find(s => s[0] === serviceId);
    return service ? -service[1] : 999;
  };

  // دالة حساب المسافة بين نقطتين (Haversine formula)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number): number => {
    const R = 6371; // نصف قطر الأرض بالكيلومتر
    const dLat = (lat2 - lat1) * (Math.PI / 180);
    const dLon = (lon2 - lon1) * (Math.PI / 180);
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // التحقق من القرب من المطار
  const isNearAirport = (): boolean => {
    const airportLat = 24.9578;
    const airportLng = 46.6980;
    const distance = calculateDistance(userLocation.lat, userLocation.lng, airportLat, airportLng);
    return distance <= 7; // إذا كان الموقع ضمن 7 كيلو من المطار
  };

  const logVisit = (serviceName: string) => {
    fetch("http://127.0.0.1:5000/log_visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ service: serviceName }),
    })
    .then(res => res.json())
    .then(data => {
      console.log("Visit logged:", data);
    })
    .catch(err => console.error("Error logging visit:", err));
  };

  // دالة للتحقق من الخدمة نشطة أم لا
  const isServiceActive = (serviceId: string): boolean => {
    const service = services.find(s => s[0] === serviceId);
    return service ? service[1] : false;
  };

  return (
    <div className="min-h-screen flex justify-center bg-[#105036] font-['Cairo'] text-white">
      {/* Mobile Container */}
      <div className="w-full max-w-[460px] bg-[#105036] relative shadow-2xl min-h-screen pb-32 overflow-y-auto flex flex-col">
        
        {/* Settings Modal */}
        {showSettings && (
          <div className="fixed inset-0 max-w-[460px] mx-auto bg-black/50 z-50 rounded-2xl p-4 overflow-y-auto">
            <div className="bg-[#1F1F1F] rounded-2xl p-6 mt-8">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-white">إعدادات البيانات</h2>
                <button 
                  onClick={() => setShowSettings(false)}
                  className="text-[#A0A0A0] text-2xl hover:text-white"
                >
                  ✕
                </button>
              </div>

              {/* Location Settings */}
              <div className="mb-6 pb-6 border-b border-[#2C2E30]">
                <h3 className="text-lg font-bold text-white mb-3">📍 الموقع</h3>
                <div className="space-y-3">
                  <div>
                    <label className="text-[#A0A0A0] text-sm">خط العرض (Latitude)</label>
                    <input 
                      type="number" 
                      value={userLocation.lat}
                      onChange={(e) => setUserLocation({...userLocation, lat: parseFloat(e.target.value)})}
                      className="w-full bg-[#2A2D31] border border-[#4DB6AC] rounded-lg px-3 py-2 text-white mt-1"
                      step="0.0001"
                    />
                  </div>
                  <div>
                    <label className="text-[#A0A0A0] text-sm">خط الطول (Longitude)</label>
                    <input 
                      type="number" 
                      value={userLocation.lng}
                      onChange={(e) => setUserLocation({...userLocation, lng: parseFloat(e.target.value)})}
                      className="w-full bg-[#2A2D31] border border-[#4DB6AC] rounded-lg px-3 py-2 text-white mt-1"
                      step="0.0001"
                    />
                  </div>
                  <div className="flex items-center justify-between bg-[#2A2D31] rounded-lg px-3 py-2 mt-3">
                    <span className="text-[#A0A0A0] text-sm">قريب من المطار</span>
                    <div className={`w-12 h-6 rounded-full flex items-center transition-colors ${
                      isNearAirport() ? 'bg-[#4DB6AC]' : 'bg-[#555555]'
                    }`}>
                      <div className={`w-5 h-5 rounded-full bg-white transition-transform ${
                        isNearAirport() ? 'translate-x-6' : 'translate-x-0.5'
                      }`}></div>
                    </div>
                  </div>
                  <button 
                    onClick={saveCustomData}
                    className="w-full bg-[#4DB6AC] text-[#105036] font-bold rounded-lg py-2 mt-3 hover:bg-[#6ECAC0]"
                  >
                    حفظ الموقع
                  </button>
                </div>
              </div>

              {/* ID Expiry Settings */}
              <div className="mb-6 pb-6 border-b border-[#2C2E30]">
                <h3 className="text-lg font-bold text-white mb-3">🆔 تاريخ انتهاء الهوية</h3>
                <div>
                  <input 
                    type="date" 
                    value={idExpiry}
                    onChange={(e) => setIdExpiry(e.target.value)}
                    className="w-full bg-[#2A2D31] border border-[#4DB6AC] rounded-lg px-3 py-2 text-white"
                  />
                  <button 
                    onClick={updateIdExpiry}
                    className="w-full bg-[#4DB6AC] text-[#105036] font-bold rounded-lg py-2 mt-3 hover:bg-[#6ECAC0]"
                  >
                    حفظ التاريخ
                  </button>
                </div>
              </div>

              {/* Visits Settings */}
              <div className="mb-6 pb-6 border-b border-[#2C2E30]">
                <h3 className="text-lg font-bold text-white mb-3">🔫 الأسلحة</h3>
                <div className="space-y-3">
                  <div className="flex gap-3">
                    <button 
                      onClick={() => {
                        setHasWeapons(true);
                        updateVisits("weapons", 1);
                      }}
                      className={`flex-1 px-4 py-2 rounded-lg font-bold transition-colors ${
                        hasWeapons 
                          ? 'bg-[#4DB6AC] text-[#105036]' 
                          : 'bg-[#2A2D31] text-[#A0A0A0] border border-[#4DB6AC]'
                      }`}
                    >
                      ✓ صح
                    </button>
                    <button 
                      onClick={() => {
                        setHasWeapons(false);
                        updateVisits("weapons", 0);
                      }}
                      className={`flex-1 px-4 py-2 rounded-lg font-bold transition-colors ${
                        !hasWeapons 
                          ? 'bg-[#FF6B6B] text-white' 
                          : 'bg-[#2A2D31] text-[#A0A0A0] border border-[#FF6B6B]'
                      }`}
                    >
                      ✗ خطأ
                    </button>
                  </div>
                </div>
              </div>

              {/* Plates Auction Settings */}
              <div className="mb-6 pb-6 border-b border-[#2C2E30]">
                <h3 className="text-lg font-bold text-white mb-3">🏆 مزاد اللوحات</h3>
                <div>
                  <label className="text-[#A0A0A0] text-sm">عدد المشاركات</label>
                  <input 
                    type="number" 
                    value={platesAuctionVisits}
                    onChange={(e) => setPlatesAuctionVisits(parseInt(e.target.value) || 0)}
                    className="w-full bg-[#2A2D31] border border-[#4DB6AC] rounded-lg px-3 py-2 text-white mt-2"
                  />
                  <button 
                    onClick={() => updateVisits("plates_auction", platesAuctionVisits)}
                    className="w-full bg-[#4DB6AC] text-[#105036] font-bold rounded-lg py-2 mt-3 hover:bg-[#6ECAC0]"
                  >
                    حفظ المشاركات
                  </button>
                </div>
              </div>

              {/* Visits Settings */}
              <div className="mb-6 pb-6 border-b border-[#2C2E30]">
                <h3 className="text-lg font-bold text-white mb-3">🚗 عدد زيارات المركبات</h3>
                <div>
                  <input 
                    type="number" 
                    value={weaponsVisits}
                    onChange={(e) => setWeaponsVisits(parseInt(e.target.value))}
                    className="w-full bg-[#2A2D31] border border-[#4DB6AC] rounded-lg px-3 py-2 text-white"
                  />
                  <button 
                    onClick={() => updateVisits("weapons", weaponsVisits)}
                    className="w-full bg-[#4DB6AC] text-[#105036] font-bold rounded-lg py-2 mt-3 hover:bg-[#6ECAC0]"
                  >
                    حفظ الزيارات
                  </button>
                </div>
              </div>

              {/* Current Data */}
              <div className="bg-[#2A2D31] rounded-lg p-4">
                <h3 className="text-sm font-bold text-[#4DB6AC] mb-2">📊 البيانات الحالية</h3>
                <p className="text-xs text-[#A0A0A0] mb-1">الموقع: {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}</p>
                <p className="text-xs text-[#A0A0A0] mb-1">تاريخ الهوية: {idExpiry}</p>
                <p className="text-xs text-[#A0A0A0] mb-1">السلاح: {hasWeapons ? "نعم ✓" : "لا ✗"}</p>
                <p className="text-xs text-[#A0A0A0]">مزاد اللوحات: {platesAuctionVisits} مشاركة</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Header */}
        <div className="px-3 py-6">
          <div className="bg-[#2C2E30] rounded-2xl p-3 flex flex-row-reverse items-center justify-between shadow-lg">
            <div className="flex flex-col items-end flex-1 gap-0.5">
              <h1 className="text-base font-bold text-white leading-tight">{user.name}</h1>
              <p className="text-[#A0A0A0] text-xs font-light">رقم الهوية: {user.id}</p>
            </div>
            <button 
              onClick={() => setShowSettings(!showSettings)}
              className="text-[#4DB6AC] text-lg hover:text-white ml-2 transition-colors"
              title="إعدادات البيانات"
            >
              ⚙️
            </button>
            <ProfileIcon />
          </div>
        </div>


        {/* Digital Documents */}
        <div className="relative px-3 mb-4">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-lg font-bold text-white">وثائقي الرقمية</h2>
            <button className="text-[#4DB6AC] text-xs font-medium">عرض الكل</button>
          </div>

          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 snap-x">
            {documents.map((doc) => (
              <div 
                key={doc.id}
                className="shrink-0 w-[120px] h-[75px] rounded-xl p-2 flex flex-col justify-between shadow-md snap-start cursor-pointer"
                style={{ background: doc.gradient }}
              >
                <div className="self-end w-1.5 h-1.5 rounded-full bg-white/20"></div>
                <span className="text-white text-xs font-bold text-right">{doc.title}</span>
              </div>
            ))}
          </div>
        </div>


        {/* Quick Access Services */}
        <div className="px-3 flex-1">
          <h2 className="text-lg font-bold text-white mb-3 text-right">الوصول السريع</h2>

          <div className="flex flex-col gap-2">

            {/* Row 1 */}
            <div className="flex gap-2">
              <div 
                id="travel"
                onClick={() => logVisit("travel")}
                className="flex-1 bg-[#2A2D31] rounded-xl p-2 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:bg-[#323539] transition-colors h-[90px]"
                style={{ order: getServiceOrder("travel") }}
              >
                <MapIcon />
                <h3 className="text-white text-xs font-medium">أبشر سفر</h3>
              </div>

              <div 
                id="renew_id"
                onClick={() => logVisit("renew_id")}
                className="flex-1 bg-[#2A2D31] rounded-xl p-2 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:bg-[#323539] transition-colors h-[90px]"
                style={{ order: getServiceOrder("renew_id") }}
              >
                <FingerprintIcon />
                <h3 className="text-white text-xs font-medium">تجديد الهوية</h3>
              </div>
            </div>

            {/* Row 2 */}
            <div className="flex gap-2">
              <div 
                id="traffic"
                onClick={() => logVisit("traffic")}
                className="flex-1 bg-[#2A2D31] rounded-xl p-2 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:bg-[#323539] transition-colors h-[90px]"
                style={{ order: getServiceOrder("traffic") }}
              >
                <BillIcon />
                <h3 className="text-white text-xs font-medium">المخالفات المرورية</h3>
              </div>

              <div 
                id="delivery"
                onClick={() => logVisit("delivery")}
                className="flex-1 bg-[#2A2D31] rounded-xl p-2 flex flex-col items-center justify-center gap-2 text-center cursor-pointer hover:bg-[#323539] transition-colors h-[90px]"
                style={{ order: getServiceOrder("delivery") }}
              >
                <BoxIcon />
                <h3 className="text-white text-xs font-medium">توصيل الوثائق</h3>
              </div>
            </div>

            {/* Plates Auction */}
            {isServiceActive("plates_auction") && (
            <div 
              id="plates_auction"
              className="w-full bg-[#2A2D31] rounded-xl p-3 cursor-pointer hover:bg-[#323539] transition-colors shadow-sm"
              onClick={() => logVisit("plates_auction")}
              style={{ order: getServiceOrder("plates_auction") }}
            >
              <div className="flex flex-row-reverse items-center gap-3">
                <CarIcon />
                <div className="flex-1 text-right">
                  <h3 className="text-white text-sm font-medium mb-0.5">مزاد اللوحات</h3>
                  <p className="text-[#A0A0A0] text-xs">شراء لوحات مركبات.</p>
                </div>
              </div>
            </div>
            )}

            {/* Weapons */}
            {isServiceActive("weapons") && (
            <div 
              id="weapons"
              className="w-full bg-[#2A2D31] rounded-xl p-3 cursor-pointer hover:bg-[#323539] transition-colors shadow-sm"
              onClick={() => logVisit("weapons")}
              style={{ order: getServiceOrder("weapons") }}
            >
              <div className="flex flex-row-reverse items-center gap-3">
                <GunIcon />
                <div className="flex-1 text-right">
                  <h3 className="text-white text-sm font-medium mb-0.5">أسلحتي</h3>
                  <p className="text-[#A0A0A0] text-xs">خدمات الأسلحة والذخيرة.</p>
                </div>
              </div>
            </div>
            )}

            {/* Vehicles - Always at bottom */}
            <div 
              className="w-full bg-[#2A2D31] rounded-xl p-3 cursor-pointer hover:bg-[#323539] transition-colors shadow-sm"
              onClick={() => logVisit("vehicles")}
            >
              <div className="flex flex-row-reverse items-center gap-3">
                <CarIcon />
                <div className="flex-1 text-right">
                  <h3 className="text-white text-sm font-medium mb-0.5">مركباتي</h3>
                  <p className="text-[#A0A0A0] text-xs">عرض تفاصيل المركبات.</p>
                </div>
              </div>
            </div>

          </div>
        </div>


        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 max-w-[460px] mx-auto bg-[#1F1F1F] rounded-t-[30px] shadow-[0_-5px_20px_rgba(0,0,0,0.5)] px-6 py-4 z-50">
          <div className="flex justify-between items-center px-4">

            <NavButton 
              active={activeTab === 'other'} 
              label="خدمات أخرى" 
              onClick={() => setActiveTab('other')}
              icon={<MenuIcon active={activeTab === 'other'} />} 
            />

            <NavButton 
              active={activeTab === 'services'} 
              label="خدماتي" 
              onClick={() => setActiveTab('services')}
              icon={<ServicesIcon active={activeTab === 'services'} />} 
            />

            <NavButton 
              active={activeTab === 'home'} 
              label="الرئيسية" 
              onClick={() => setActiveTab('home')}
              icon={<HomeIcon active={activeTab === 'home'} />} 
            />

          </div>
        </div>

      </div>
    </div>
  );
}

interface NavButtonProps {
  active: boolean;
  label: string;
  onClick: () => void;
  icon: React.ReactNode;
}

const NavButton: React.FC<NavButtonProps> = ({ active, label, onClick, icon }) => (
  <button onClick={onClick} className="flex flex-col items-center gap-1.5 min-w-[64px]">
    <div className={`${active ? 'text-[#4DB6AC]' : 'text-[#A0A0A0]'}`}>
        {icon}
    </div>
    <span className={`text-xs ${active ? 'text-[#4DB6AC] font-bold' : 'text-[#A0A0A0] font-normal'}`}>
      {label}
    </span>
  </button>
);