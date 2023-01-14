import { Component, HostListener, OnInit } from '@angular/core';
import { WeatherVisualisationComponent } from "../weather-visualisation.component"
import * as d3 from 'd3';
import { WeatherInfo } from "../../shared/weather-info/weather-info"

const MIN_TEMPERATURE = -60
const MAX_TEMPERATURE = 60

@Component({
  selector: 'ambient-weather-vis-temperature-visualisation',
  templateUrl: '../weather-visualisation.component.html',
  styleUrls: ['../weather-visualisation.component.sass'],
})
export class TemperatureVisualisationComponent extends WeatherVisualisationComponent implements OnInit {
  protected svg: any
  private width = 0
  private height = 0
  private columnWidth = 0
  private columnHeight = 0
  private center = {x: 0, y: 0}
  private thermometerWidth = 0

  private yScale: d3.ScaleLinear<number, number> = d3.scaleLinear()
  private yAxisHeight = 0

  private bar: any
  private currTemperature = 0

  private barHeightAnimationDurationScale = d3.scaleLinear()
    .domain([0, MAX_TEMPERATURE])
    .range([0, 6000])

  private colorScale = d3.scaleLinear<string, string>()
    .domain([MIN_TEMPERATURE, -10, 0, 10, 20, 25, 30, 40, MAX_TEMPERATURE])
    .range(['darkblue', 'blue', 'lightblue', 'lightblue', 'yellow', 'orange', 'lightRed', 'red', 'darkred'])
    .interpolate(d3.interpolateHcl)

  public constructor() {
    super()
    this.question = 'How is the temperature in'
  }

  public override ngOnInit(): void {
    super.ngOnInit()
    this.drawThermometer()
  }

  @HostListener('window:resize')
  public onResize() {
    document.querySelector('svg')?.remove()
    this.drawThermometer()
    this.visualiseCurrentTemperature()
  }

  protected override updateVisualisation(info: WeatherInfo): void {
    const prevTemperature = this.bar.data()[0]
    this.currTemperature = info.temperature
    if (prevTemperature !== this.currTemperature) {
      const startTemperature = this.currTemperature === 0 ? 0.1 : 0
      if (prevTemperature === null) {
        this.visualiseCurrentTemperature(true)
      } else if (prevTemperature >= 0 && this.currTemperature >= 0) {
        this.bar
          .data([this.currTemperature])
          .transition().duration(this.barHeightAnimationDurationScale(Math.abs(this.currTemperature - prevTemperature)))
          .attr('y', (temperature: number) => this.currTemperature === 0 ? this.yScale(startTemperature) : this.yScale(temperature))
          .attr('height', (temperature: number) => this.yScale(0) - this.yScale(this.currTemperature === 0 ? startTemperature : temperature))
          .attr('fill', this.colorScale(this.currTemperature))
      } else if (prevTemperature <= 0 && this.currTemperature <= 0) {
        this.bar
          .data([this.currTemperature])
          .attr('y', this.yScale(startTemperature))
          .transition().duration(this.barHeightAnimationDurationScale(Math.abs(this.currTemperature - prevTemperature)))
          .attr('height', (temperature: number) => this.yScale(temperature) - this.yScale(startTemperature))
          .attr('fill', this.colorScale(this.currTemperature))
      } else {
        if (prevTemperature <= 0 && this.currTemperature > 0) {
          this.bar
            .data([this.currTemperature])
            .transition().duration(this.barHeightAnimationDurationScale(Math.abs(prevTemperature)))
            .attr('y', this.yScale(startTemperature))
            .attr('height', 0)
            .transition().duration(this.barHeightAnimationDurationScale(Math.abs(this.currTemperature - prevTemperature)))
            .attr('y', (temperature: number) => this.yScale(temperature))
            .attr('height', (temperature: number) => this.yScale(startTemperature) - this.yScale(temperature))
            .attr('fill', this.colorScale(this.currTemperature))
        } else {
          this.bar
            .data([this.currTemperature])
            .transition().duration(this.barHeightAnimationDurationScale(prevTemperature))
            .attr('y', this.yScale(startTemperature))
            .attr('height', 0)
            .transition().duration(this.barHeightAnimationDurationScale(Math.abs(this.currTemperature - prevTemperature)))
            .attr('height', (temperature: number) => this.yScale(temperature) - this.yScale(startTemperature))
            .attr('fill', this.colorScale(this.currTemperature))
        }
      }
    }
  }

  private visualiseCurrentTemperature(withAnimation = false): void {
    setTimeout(() => {
      if (this.currTemperature > 0) {
        this.bar
          .data([this.currTemperature])
          .transition().duration(withAnimation ? this.barHeightAnimationDurationScale(this.currTemperature) : 0)
          .attr('y', this.yScale(this.currTemperature))
          .attr('height', (temperature: number) => this.yScale(0) - this.yScale(temperature))
          .attr('fill', this.colorScale(this.currTemperature))
      } else if (this.currTemperature < 0) {
        this.bar
          .data([this.currTemperature])
          .transition().duration(withAnimation ? this.barHeightAnimationDurationScale(Math.abs(this.currTemperature)) : 0)
          .attr('y', this.yScale(0))
          .attr('height', (temperature: number) => this.yScale(temperature) - this.yScale(0))
          .attr('fill', this.colorScale(this.currTemperature))
      } else {
        this.bar
          .data([0])
          .transition().duration(withAnimation ? this.barHeightAnimationDurationScale(0) : 0)
          .attr('y', this.yScale(0.1))
          .attr('height', this.yScale(0) - this.yScale(0.1))
          .attr('fill', this.colorScale(0))
      }
    })
  }

  private drawThermometer(): void {
    this.createSvg()

    // delay until svg is loaded for extracting metrics
    setTimeout(() => {
      this.setMeasurements()
      this.drawThermometerOutline()
      this.drawAxis()
      this.createBar()
    })
  }

  private createSvg(): void {
    this.svg = d3.select('div#visualisation')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
  }

  private setMeasurements(): void {
    this.width = +this.svg
      .style('width')
      .replace('px', '')
    this.height = +this.svg
      .style('height')
      .replace('px', '')
    this.columnWidth = this.width / 10
    this.columnHeight = this.height / 10
    this.center = {x: this.width / 2, y: this.height / 2}
    this.thermometerWidth = 2 * this.columnWidth / 3
  }

  private drawThermometerOutline(): void {
    const rx = this.thermometerWidth / 2
    const ry = rx
    const lineHeight = 8.75 * this.columnHeight
    this.yAxisHeight = lineHeight
    const outline =
      "M" + (this.center.x - rx) + "," + (this.columnHeight) +
      "A" + rx + "," + ry + " 0 0 1 " + (this.center.x + rx) + "," + (this.columnHeight) +
      "L" + (this.center.x + rx) + "," + lineHeight +
      "A" + rx + "," + ry + " 0 0 1 " + (this.center.x - rx) + "," + lineHeight +
      "L" + (this.center.x - rx) + "," + (this.columnHeight)

    this.svg.append("path")
      .attr("d", outline)
      .attr("stroke", "black")
      .attr("stroke-width", 2)
      .attr("fill", "none")
  }

  private drawAxis(): void {
    this.yScale = d3.scaleLinear()
      .domain([MIN_TEMPERATURE, MAX_TEMPERATURE])
      .range([this.yAxisHeight, this.columnHeight])

    const tickLength = this.thermometerWidth / 5
    const yAxis = d3.axisLeft(this.yScale)
      .ticks(25)
      .tickSize(tickLength)
      .tickFormat(temperature => this.temperatureEndsWithFive(temperature) ? '' : temperature.toString())

    const yAxisElement = this.svg.append("g")
      .attr('transform', `translate(${this.center.x},${0})`)
      .call(yAxis)

    const ticks = yAxisElement.selectAll('g.tick')
    ticks
      .select('line')
      .filter((temperature: number) => this.temperatureEndsWithFive(temperature))
      .style('stroke-dasharray', tickLength / 2)

    const fontSize = tickLength * 0.75
    ticks
      .select('text')
      .attr("font-size", fontSize)

    this.svg
      .append('text')
      .attr('x', this.center.x - this.thermometerWidth / 20)
      .attr('y', this.columnHeight - this.thermometerWidth / 4)
      .text('C°')
      .attr('font-size', fontSize)
      .attr('fill', 'gray')
  }

  private temperatureEndsWithFive(temperature: number | { valueOf(): number }): boolean {
    return temperature.toString().endsWith('5')
  }

  private createBar(): void {
    this.bar = this.svg
      .append('rect')
      .data([null])
      .attr('x', this.center.x)
      .attr('y', this.yScale(0))
      .attr('width', this.thermometerWidth / 4)
      .attr('height', 0)
  }
}
