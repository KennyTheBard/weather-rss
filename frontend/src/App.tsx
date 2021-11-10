import React from 'react';
import './App.scss';
import ForecastCountry from './components/forecast-country';
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
        <div className='alerts'>
          {this.state.alerts.map((alert, idx) => <div key={idx} dangerouslySetInnerHTML={{ __html: alert }} />)}
        </div>

        <div className='forecast'>
          {this.state.forecasts.map(f => <ForecastCountry forecast={f}></ForecastCountry>)}
        </div>
      </div>
    );
  }
}

