import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const AddressPicker = ({ onSelect }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [provinceCode, setProvinceCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [wardCode, setWardCode] = useState("");

  // Cache để tránh gọi lại nếu đã load rồi
  const [districtCache, setDistrictCache] = useState({});
  const [wardCache, setWardCache] = useState({});

  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await axios.get(
          "https://provinces.open-api.vn/api/?depth=1"
        );
        setProvinces(res.data);
      } catch (err) {
        console.error("Failed to load provinces", err);
      }
    };
    fetchProvinces();
  }, []);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!provinceCode) return;
      if (districtCache[provinceCode]) {
        setDistricts(districtCache[provinceCode]);
        return;
      }

      try {
        const res = await axios.get(
          `https://provinces.open-api.vn/api/p/${provinceCode}?depth=2`
        );
        setDistricts(res.data.districts);
        setDistrictCache((prev) => ({
          ...prev,
          [provinceCode]: res.data.districts,
        }));
      } catch (err) {
        console.error("Failed to load districts", err);
      }
    };

    setDistrictCode("");
    setWardCode("");
    setWards([]);
    fetchDistricts();
  }, [provinceCode]);

  useEffect(() => {
    const fetchWards = async () => {
      if (!districtCode) return;
      if (wardCache[districtCode]) {
        setWards(wardCache[districtCode]);
        return;
      }

      try {
        const res = await axios.get(
          `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
        );
        setWards(res.data.wards);
        setWardCache((prev) => ({ ...prev, [districtCode]: res.data.wards }));
      } catch (err) {
        console.error("Failed to load wards", err);
      }
    };

    setWardCode("");
    fetchWards();
  }, [districtCode]);

  useEffect(() => {
    if (provinceCode && districtCode && wardCode) {
      const province = provinces.find((p) => p.code === +provinceCode);
      const district = districts.find((d) => d.code === +districtCode);
      const ward = wards.find((w) => w.code === +wardCode);

      const location = `${ward?.name}, ${district?.name}, ${province?.name}`;
      const city = province?.name;

      onSelect({ location, city });
    }
  }, [provinceCode, districtCode, wardCode]);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="text-sm text-white block mb-1">
          Tỉnh / Thành phố
        </label>
        <select
          value={provinceCode}
          onChange={(e) => setProvinceCode(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
        >
          <option value="">-- Chọn tỉnh/thành --</option>
          {provinces.map((p) => (
            <option key={p.code} value={p.code}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm text-white block mb-1">Quận / Huyện</label>
        <select
          value={districtCode}
          onChange={(e) => setDistrictCode(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
          disabled={!provinceCode}
        >
          <option value="">-- Chọn quận/huyện --</option>
          {districts.map((d) => (
            <option key={d.code} value={d.code}>
              {d.name}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm text-white block mb-1">Xã / Phường</label>
        <select
          value={wardCode}
          onChange={(e) => setWardCode(e.target.value)}
          className="w-full p-2 rounded bg-gray-800 text-white"
          disabled={!districtCode}
        >
          <option value="">-- Chọn xã/phường --</option>
          {wards.map((w) => (
            <option key={w.code} value={w.code}>
              {w.name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
};
AddressPicker.propTypes = {
  onSelect: PropTypes.func.isRequired,
};

export default AddressPicker;
