import { Component } from '@angular/core';
import { Health } from '@awesome-cordova-plugins/health/ngx';
import { Platform } from '@ionic/angular';
import { HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  constructor(
    private health: Health, 
    private platform: Platform, 
    private http: HttpClient) {
    this.platform.ready().then(() => {
      this.requestHealthAuthorization();
    });
  }

  requestHealthAuthorization() {
    this.health.isAvailable().then((available) => {
      if (available) {
        // Request read permission for step count and heart rate
        this.health.requestAuthorization([
          {
            read: ['steps', 'heart_rate', 'distance', 'calories'],
          }
        ]).then(res => console.log('HealthKit Authorized'), 
                err => console.log('Error: ', err));
      }
    });
  }

  fetchHealthData() {
    this.health.query({
      startDate: new Date(new Date().setDate(new Date().getDate() - 1)), // yesterday
      endDate: new Date(), // now
      dataType: 'steps',
      limit: 1000
    }).then(data => {
      console.log('Steps: ', data);
    }, err => {
      console.log('Error fetching steps: ', err);
    });
  }

  fetchHeartRateData() {
    this.health.query({
      startDate: new Date(new Date().setDate(new Date().getDate() - 1)),
      endDate: new Date(),
      dataType: 'heart_rate',
      limit: 1000
    }).then(data => {
      console.log('Heart Rate: ', data);
    }, err => {
      console.log('Error fetching heart rate: ', err);
    });
  }

  exportDataToAPI(steps: any, heartRate: any) {
    const data = {
      steps: steps,
      heartRate: heartRate
    };

    this.http.post('https://yourapi.com/export', data)
      .subscribe(response => {
        console.log('Data exported: ', response);
      }, error => {
        console.log('Error exporting data: ', error);
      });
      
  }
  
}
