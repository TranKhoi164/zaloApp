module.exports = {
  purge: {
    enabled: true,
    content: ["./src/**/*.{js,jsx,ts,tsx,vue}"],
  },
  theme: {
    extend: {
      boxShadow: {
        '4xl': '0 35px 60px -15px rgba(0, 0, 0, 0.3)',
      }
    },
  },
};
