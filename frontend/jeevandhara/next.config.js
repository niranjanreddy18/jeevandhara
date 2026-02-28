module.exports = {
  async rewrites() {
    return [
      {
        source: "/hello",
        destination: "http://127.0.0.1:8000/api/hello/", // Proxy to Django backend
      },
    ];
  },
};
