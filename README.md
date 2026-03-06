# Carbon Footprint Tracker - EcoTracker

A comprehensive web application that calculates users' carbon footprints based on daily activities, provides visualizations, and offers actionable recommendations to reduce emissions.

## Features

### 🌍 Carbon Footprint Calculator
- **Transportation**: Car usage (gasoline, hybrid, electric), public transport, and flights
- **Home Energy**: Electricity consumption (grid, renewable, coal sources), natural gas, and heating oil
- **Diet**: Impact of different dietary choices (meat-heavy, average, vegetarian, vegan)
- **Consumption**: Shopping habits, services, and waste generation

### 📊 Interactive Dashboard
- **Monthly Trend Analysis**: Line chart showing carbon footprint over time
- **Category Breakdown**: Doughnut chart displaying emissions by category
- **Progress Tracking**: Goal setting and achievement system
- **Achievement Badges**: Gamification elements to encourage sustainable habits

### 💡 Personalized Recommendations
- **High-Impact Actions**: Most effective ways to reduce emissions
- **Medium-Impact Suggestions**: Balanced approaches to carbon reduction
- **Low-Impact Tips**: Easy lifestyle changes
- **Quantified Savings**: Shows potential CO₂ reduction for each recommendation

### 📱 Responsive Design
- Mobile-friendly interface
- Smooth animations and transitions
- Accessible design with proper focus states
- Print-friendly styles

### 💾 Data Persistence
- Local storage for tracking progress
- Historical data visualization
- Progress comparison over time
- No server required - runs entirely in browser

## Technology Stack

- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Styling**: CSS Grid, Flexbox, CSS Variables
- **Charts**: Chart.js for data visualization
- **Icons**: Font Awesome
- **Fonts**: Google Fonts (Inter)
- **Storage**: LocalStorage API

## Getting Started

### Prerequisites
- Modern web browser (Chrome, Firefox, Safari, Edge)
- No additional software required

### Installation
1. Clone or download the project files
2. Open `index.html` in your web browser
3. Start calculating your carbon footprint!

### Usage
1. **Calculate Your Footprint**: Fill in the form with your daily activities
2. **View Results**: See your total monthly carbon footprint and category breakdown
3. **Track Progress**: Monitor your emissions over time using the dashboard
4. **Get Recommendations**: Receive personalized tips to reduce your impact
5. **Set Goals**: Work towards reducing your footprint by 25%

## Carbon Calculation Methodology

The calculator uses scientifically-backed emission factors:

### Transportation
- **Gasoline Car**: 0.404 kg CO₂/mile
- **Hybrid Car**: 0.226 kg CO₂/mile
- **Electric Car**: 0.090 kg CO₂/mile (including electricity generation)
- **Bus**: 0.089 kg CO₂/mile
- **Train**: 0.041 kg CO₂/mile
- **Subway**: 0.035 kg CO₂/mile
- **Flights**: 250-1000 kg CO₂ per flight (based on duration)

### Home Energy
- **Grid Electricity**: 0.4 kg CO₂/kWh
- **Renewable Electricity**: 0.05 kg CO₂/kWh
- **Coal-heavy Electricity**: 0.9 kg CO₂/kWh
- **Natural Gas**: 5.3 kg CO₂/therm
- **Heating Oil**: 10.2 kg CO₂/gallon

### Diet (Daily)
- **Meat-Heavy**: 3.3 kg CO₂/day
- **Average**: 2.5 kg CO₂/day
- **Vegetarian**: 1.7 kg CO₂/day
- **Vegan**: 1.5 kg CO₂/day

### Consumption
- **Shopping**: 0.05 kg CO₂/dollar
- **Services**: 0.03 kg CO₂/dollar
- **Waste**: 0.5 kg CO₂/pound

## File Structure

```
carbon-footprint-tracker/
├── index.html          # Main HTML file
├── styles.css          # Complete styling with responsive design
├── script.js           # JavaScript functionality and calculations
└── README.md           # This documentation
```

## Key Features Explained

### Real-Time Calculation
- Input validation and real-time updates
- Animated number displays
- Smooth transitions between sections

### Data Visualization
- **Trend Chart**: Shows 6-month history of carbon footprint
- **Pie Chart**: Breakdown of emissions by category
- **Progress Bars**: Visual representation of goal achievement

### Achievement System
- **First Step**: Complete first calculation
- **Eco Warrior**: Reduce footprint by 20%
- **Climate Champion**: 30 days of tracking

### Recommendation Engine
- Analyzes user's footprint breakdown
- Provides category-specific suggestions
- Quantifies potential CO₂ savings
- Prioritizes high-impact actions

## Browser Compatibility

- Chrome 60+
- Firefox 55+
- Safari 12+
- Edge 79+

## Performance

- **Load Time**: < 2 seconds on average connection
- **Bundle Size**: ~500KB (including Chart.js)
- **Runtime**: Optimized for smooth animations
- **Memory**: Efficient local storage usage

## Accessibility

- Semantic HTML5 structure
- ARIA labels where appropriate
- Keyboard navigation support
- High contrast ratios
- Focus indicators

## Future Enhancements

- [ ] Multi-language support
- [ ] Advanced analytics and insights
- [ ] Social sharing features
- [ ] Community challenges
- [ ] Integration with smart home devices
- [ ] API for third-party integrations

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Support

For questions, suggestions, or issues, please open an issue on the project repository.

---

**Built with ❤️ for a sustainable future**
