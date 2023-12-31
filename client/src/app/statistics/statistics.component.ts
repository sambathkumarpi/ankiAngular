// statistics.component.ts
import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import * as Highcharts from 'highcharts';
import HeatmapModule from 'highcharts/modules/heatmap';
HeatmapModule(Highcharts);
import { ChangeDetectorRef } from '@angular/core';
const chartColors = Highcharts.getOptions()?.colors;

@Component({
  selector: 'app-statistics',
  templateUrl: './statistics.component.html',
  styleUrls: ['./statistics.component.css'],
})
export class StatisticsComponent implements OnInit {
  statisticsData: any[] = [];
  highcharts = Highcharts;
  chartOptions: Highcharts.Options = {};

  constructor(private testSessionService: SessionService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.testSessionService.getSessionData().subscribe((data) => {
      console.log('Received data:', data);
      if (data.length === 0) {
        console.log('No data received.');
        return;
      }
      this.statisticsData = data;
      this.chartOptions = this.buildChartOptions(data);

      this.cdr.detectChanges();
      console.log('Chart options:', this.chartOptions);

    });
  }

  private buildChartOptions(data: any[]): Highcharts.Options {
    const dataPoints: any[] = [];
    console.log('data point', dataPoints)
    // Map SQL data to Highcharts format
    data.forEach(session => {
      const startTime = new Date(session.start_time);
      const endTime = new Date(session.end_time);

      // Assuming you want to consider each hour as a data point
      for (let hour = startTime.getHours(); hour <= endTime.getHours(); hour++) {
        const date = new Date(startTime);
        date.setHours(hour, 0, 0, 0);

        dataPoints.push([session.subject_id, date.getTime(), 1]); // The third parameter (1) represents intensity
      }
    });

    return {
      chart: {
        type: 'heatmap',
      },
      title: {
        text: 'Test Sessions Calendar Heatmap',
      },
      xAxis: {
        type: 'category',
        // categories: data.map((session) => session.subject_id.toString()),
        title: {
          text: 'Subject ID',
        },
      },
      yAxis: {
        type: 'datetime',
        // categories: data.map((session) => new Date(session.start_time).toISOString()), // Use toISOString() to convert to string
        title: {
          text: 'Start Time',
        },
      },

      colorAxis: {
        min: 0,
        minColor: '#FFFFFF',
        maxColor: chartColors ? chartColors[0] : '#FFFFFF',
      },
      series: [
        {
          type: 'heatmap',
          borderWidth: 1,
          dataLabels: {
            enabled: true,
            color: '#0FFF00',
          },
          data: dataPoints,
        },
      ],
    };
  }
}
