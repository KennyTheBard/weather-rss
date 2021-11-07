import React from 'react';
import './App.css';
import ForecastDay from './components/forecast-day';
import DataService from './services/data-service';
import { CountryForecast } from './type';


type AppState = {
  forecasts: CountryForecast[];
  alerts: string[];
}

export default class App extends React.Component {

  state: AppState = {
    forecasts: [],
    alerts: []
  };

  componentDidMount() {
    this.refreshData();
  }

  refreshData = async () => {
    console.log("Refresh data in progress...");

    const data = await DataService.getFreshData();

    console.log("Data refreshened!")

    this.setState({
      forecasts: data.forecasts,
      alerts: data.alerts
    });
  }

  render() {
    return (
      <div>
        <input type="button" onClick={this.refreshData} value="Refresh" />
        <p>Alerts</p>
        {this.state.alerts.map((alert, idx) => <div key={idx} dangerouslySetInnerHTML={{ __html: alert }} />)}

        {this.state.forecasts.map(f =>
          <div>
            <div>
              {f.name}
            </div>
            <div>
              {f.forecasts.map(fc => <ForecastDay forecast={fc}></ForecastDay>)}
            </div>
          </div>
        )}
      </div>
    );
  }
}

