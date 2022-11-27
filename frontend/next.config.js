/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  env: {
    API_URL: 'http://localhost:8000',
    MAPBOX_ACCESS_TOKEN: 'pk.eyJ1IjoiaGF4MiIsImEiOiJjbGF5cnVkY3Ywbnp5M3Vyc3d2MW9hZmZoIn0.gSpIURRkDyDWCkdci_REvA'
  }
}

module.exports = nextConfig
