// statistics.component.ts
import { Component, OnInit } from '@angular/core';
import { SessionService } from '../session.service';
import * as Highcharts from 'highcharts';
import HeatmapModule from 'highcharts/modules/heatmap';
HeatmapModule(Highcharts);
const chartColors = Highcharts.getOptions()?.colors;
import { ChangeDetectorRef } from '@angular/core';

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
      this.statisticsData = data;
      this.chartOptions = this.buildChartOptions(data);
      console.log('Chart options:', this.chartOptions);

      this.cdr.detectChanges();

    });
  }

  private buildChartOptions(data: any[]): Highcharts.Options {
    return {
      chart: {
        type: 'heatmap',
      },
      title: {
        text: 'Test Sessions Heatmap',
      },
      xAxis: {
        categories: data.map((session) => session.subject_id.toString()),
        title: {
          text: 'Subject ID',
        },
      },
      yAxis: {
        categories: data.map((session) => session.start_time),
        title: {
          text: 'Start Time',
        },
      },
      colorAxis: {
        min: 0,
        minColor: '#FFFFFF',
        maxColor: chartColors ? chartColors[0] : '#FFFFFF',
      },
      series: [{
        type: 'heatmap', // Add this line
        data: data.map((session) => [session.subject_id, session.start_time, 1]),
        borderWidth: 1,
        dataLabels: {
          enabled: true,
          color: '#0FFF00',
        },
      }],
    };
  }


}
