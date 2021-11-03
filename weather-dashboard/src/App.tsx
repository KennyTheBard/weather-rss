import React from 'react';
import './App.css';
import DataService from './services/data-service';
import { CountryForecast } from './type';


type AppState = {
  forecasts: CountryForecast[];
  alerts: string[];
}

class App extends React.Component {

  state: AppState = {
    forecasts: [],
    alerts: []
  };

  componentDidMount() {

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
        <input type="button" onClick={this.refreshData} value="Refresh"/>
        <p>Alerts</p>
        {this.state.alerts.map(alert => <div dangerouslySetInnerHTML={{ __html: alert }} />)}
        <p>Forecasts</p>
        {this.state.forecasts.map(f => <p>{f.name}: {f.forecasts.length}</p>)}
      </div>
    );
  }
}

export default App;
