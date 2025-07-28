import { useEffect, useState } from "react";
import PropTypes from "prop-types";
import axios from "axios";

const AddressPicker = ({ onSelect, initialValue }) => {
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  const [provinceCode, setProvinceCode] = useState("");
  const [districtCode, setDistrictCode] = useState("");
  const [wardCode, setWardCode] = useState("");

  // Cache để tránh gọi lại nếu đã load rồi
  const [districtCache, setDistrictCache] = useState({});
  const [wardCache, setWardCache] = useState({});

  // Gán lại giá trị khi vào edit (initialValue)
  useEffect(() => {
    const fetchProvinces = async () => {
      try {
        const res = await axios.get(
          "https://provinces.open-api.vn/api/?depth=1"
        );
        setProvinces(res.data);

        // Nếu có initialValue, tìm code của tỉnh
        if (initialValue?.city) {
          const foundProvince = res.data.find(
            (p) => p.name === initialValue.city
          );
          if (foundProvince) {
            setProvinceCode(foundProvince.code.toString());
          }
        }
      } catch (err) {
        console.error("Failed to load provinces", err);
      }
    };
    fetchProvinces();
  }, [initialValue]);

  useEffect(() => {
    const fetchDistricts = async () => {
      if (!provinceCode) return;
      if (districtCache[provinceCode]) {
        setDistricts(districtCache[provinceCode]);
        // Auto fill nếu initialValue
        if (initialValue?.location) {
          const foundDistrict = districtCache[provinceCode].find((d) =>
            initialValue.location.includes(d.name)
          );
          if (foundDistrict) setDistrictCode(foundDistrict.code.toString());
        }
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

        // Auto fill nếu initialValue
        if (initialValue?.location) {
          const foundDistrict = res.data.districts.find((d) =>
            initialValue.location.includes(d.name)
          );
          if (foundDistrict) setDistrictCode(foundDistrict.code.toString());
        }
      } catch (err) {
        console.error("Failed to load districts", err);
      }
    };

    setDistrictCode("");
    setWardCode("");
    setWards([]);
    fetchDistricts();
    // eslint-disable-next-line
  }, [provinceCode]);

  useEffect(() => {
    const fetchWards = async () => {
      if (!districtCode) return;
      if (wardCache[districtCode]) {
        setWards(wardCache[districtCode]);
        // Auto fill nếu initialValue
        if (initialValue?.location) {
          const foundWard = wardCache[districtCode].find((w) =>
            initialValue.location.includes(w.name)
          );
          if (foundWard) setWardCode(foundWard.code.toString());
        }
        return;
      }

      try {
        const res = await axios.get(
          `https://provinces.open-api.vn/api/d/${districtCode}?depth=2`
        );
        setWards(res.data.wards);
        setWardCache((prev) => ({ ...prev, [districtCode]: res.data.wards }));
        // Auto fill nếu initialValue
        if (initialValue?.location) {
          const foundWard = res.data.wards.find((w) =>
            initialValue.location.includes(w.name)
          );
          if (foundWard) setWardCode(foundWard.code.toString());
        }
      } catch (err) {
        console.error("Failed to load wards", err);
      }
    };

    setWardCode("");
    fetchWards();
    // eslint-disable-next-line
  }, [districtCode]);

  // Chọn đủ 3 thành phần thì callback lên form cha
  useEffect(() => {
    if (provinceCode && districtCode && wardCode) {
      const province = provinces.find((p) => p.code === +provinceCode);
      const district = districts.find((d) => d.code === +districtCode);
      const ward = wards.find((w) => w.code === +wardCode);

      const location = `${ward?.name}, ${district?.name}, ${province?.name}`;
      const city = province?.name;

      // Truyền thêm address_id nếu đang edit
      onSelect({
        location,
        city,
        address_id: initialValue?.address_id ?? undefined, // Nếu có thì truyền lên
      });
    }
    // eslint-disable-next-line
  }, [provinceCode, districtCode, wardCode]);

  return (
    <div className="grid grid-cols-3 gap-4">
      <div>
        <label className="text-sm text-slate-600 block mb-2 font-medium">
          Tỉnh / Thành phố
        </label>
        <select
          value={provinceCode}
          onChange={(e) => setProvinceCode(e.target.value)}
          className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300"
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
        <label className="text-sm text-slate-600 block mb-2 font-medium">
          Quận / Huyện
        </label>
        <select
          value={districtCode}
          onChange={(e) => setDistrictCode(e.target.value)}
          className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 disabled:bg-slate-100 disabled:text-slate-400"
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
        <label className="text-sm text-slate-600 block mb-2 font-medium">
          Xã / Phường
        </label>
        <select
          value={wardCode}
          onChange={(e) => setWardCode(e.target.value)}
          className="w-full px-4 py-3 bg-white/80 border border-slate-200 rounded-xl text-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-300 disabled:bg-slate-100 disabled:text-slate-400"
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
  initialValue: PropTypes.shape({
    city: PropTypes.string,
    location: PropTypes.string,
    address_id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]), // Thêm prop này
  }),
};

export default AddressPicker;
