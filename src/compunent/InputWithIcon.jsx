import React, { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

const InputWithIcon = ({ type, name, placeholder, Icon, value, onChange }) => {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password";

  return (
    <div className="relative mb-4 w-full max-w-[24rem]">
      <Icon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        type={isPassword && showPassword ? "text" : type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className="w-full pl-10 pr-12 py-2 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary"
      />
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
};

export default InputWithIcon;
