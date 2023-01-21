import { Component, HostListener, OnInit } from '@angular/core'
import * as d3 from "d3"
import { WeatherVisualisationComponent } from "../weather-visualisation.component"
import { WeatherInfo } from "../../shared/weather-info/weather-info"

@Component({
  selector: 'ambient-weather-vis-wind-speed-visualisation',
  templateUrl: '../weather-visualisation.component.html',
  styleUrls: ['../weather-visualisation.component.sass'],
})
export class WindSpeedVisualisationComponent extends WeatherVisualisationComponent implements OnInit {
  protected svg: any
  private imgConfig = {x: 0, y: 0, size: 0}

  private gears: Gear[] = []

  private readonly startAngle = 0
  private readonly endAngle = 45
  private windSpeed = 0
  private readonly rotationDuration = 2000

  public constructor() {
    super()
    this.question = 'How is the wind speed in'
  }

  public override ngOnInit(): void {
    super.ngOnInit()
    this.drawVisualisation()
  }

  @HostListener('window:resize')
  public onResize() {
    this.stopGears()
    document.querySelector('svg')?.remove()
    this.drawVisualisation()
    setTimeout(() => this.windSpeed && this.moveGears(), 500)
  }

  protected override updateVisualisation(info: WeatherInfo): void {
    this.windSpeed = info.windSpeed
    this.moveGears()
  }

  private drawVisualisation(): void {
    this.createSvg()
    setTimeout(() => {
      this.setMeasurements()
      this.drawImage()
      setTimeout(() => this.drawGears())
    })
  }

  private createSvg(): void {
    this.svg = d3.select('div#visualisation')
      .append('svg')
      .attr('width', '100%')
      .attr('height', '100%')
  }

  private setMeasurements(): void {
    const width = +this.svg
      .style('width')
      .replace('px', '')
    const height = +this.svg
      .style('height')
      .replace('px', '')
    const center = {x: width / 2, y: height / 2}
    const imgSize = Math.round(Math.min(width, height) * 0.8)
    this.imgConfig = {
      x: center.x - imgSize / 2,
      // y: center.y - imgSize / 2,
      y: 0,
      size: imgSize
    }
  }

  private drawImage(): void {
    this.svg
      .append('image')
      .attr('href', "assets/cloud.svg")
      .attr('width', this.imgConfig.size)
      .attr('height', this.imgConfig.size)
      .attr('x', this.imgConfig.x)
      .attr('y', this.imgConfig.y)
  }

  private drawGears(): void {
    this.gears = [
      new Gear(
        1,
        {
          'cx': Math.round(this.imgConfig.x + 0.8 * this.imgConfig.size),
          'cy': Math.round(this.imgConfig.y + 0.42 * this.imgConfig.size)
        },
        Math.round(0.032 * this.imgConfig.size)
      ),
      new Gear(
        2,
        {
          'cx': Math.round(this.imgConfig.x + 0.5 * this.imgConfig.size),
          'cy': Math.round(this.imgConfig.y + 0.65 * this.imgConfig.size)
        },
        Math.round(0.056 * this.imgConfig.size)),
      new Gear(
        3,
        {
          'cx': Math.round(this.imgConfig.x + 0.55 * this.imgConfig.size),
          'cy': Math.round(this.imgConfig
            .y + 0.35 * this.imgConfig.size)
        },
        Math.round(0.072 * this.imgConfig.size)
      ),
      new Gear(
        4,
        {
          'cx': Math.round(this.imgConfig.x + 0.72 * this.imgConfig.size),
          'cy': Math.round(this.imgConfig.y + 0.6 * this.imgConfig.size)
        },
        Math.round(0.088 * this.imgConfig.size)
      ),
      new Gear(
        5,
        {
          'cx': Math.round(this.imgConfig.x + 0.3 * this.imgConfig.size),
          'cy': Math.round(this.imgConfig.y + 0.5 * this.imgConfig.size)
        },
        Math.round(0.1 * this.imgConfig.size)
      ),
    ]

    this.gears.forEach(gear => this.drawGear(gear))
  }

  /**
   * Creates a visual gear for each Gear class and its corresponding visual elements like
   * outerCircle1, innerCircle, cogs as lines
   * @param gear to be visualised one
   */
  private drawGear(gear: Gear): void {
    this.svg.append('circle')
      .attr('cx', gear.centerPoint.cx)
      .attr('cy', gear.centerPoint.cy)
      .attr('r', gear.rOuter1Circle + gear.paddingOuterCircle1)
      .style('fill', gear.color)

    this.svg.append('circle')
      .attr('cx', gear.centerPoint.cx)
      .attr('cy', gear.centerPoint.cy)
      .attr('r', gear.rOuter1Circle * 0.6)
      .style('fill', 'lightGray')

    const cogsGroup = this.svg.append("g").attr('class', `gear${gear.id}`)
    const cogsLinesDict = gear.generateLines().slice()

    cogsGroup
      .selectAll('line')
      .data(cogsLinesDict)
      .enter()
      .append('line')
      .attr('x1', (d: CogLine) => d.x1)
      .attr('y1', (d: CogLine) => d.y1)
      .attr('x2', (d: CogLine) => d.x2)
      .attr('y2', (d: CogLine) => d.y2)
      .attr('stroke-width', gear.rOuter1Circle * 0.5)
      .attr('stroke', gear.color)
  }

  private moveGears(): void {
    if (this.windSpeed > 0) {
      if (this.windSpeed <= 5) {
        this.stopGear(this.gears[1])
        this.stopGear(this.gears[2])
        this.stopGear(this.gears[3])
        this.stopGear(this.gears[4])

        this.activateGear(this.gears[0])
      } else if (this.windSpeed > 5 && this.windSpeed <= 10) {
        this.stopGear(this.gears[2])
        this.stopGear(this.gears[3])
        this.stopGear(this.gears[4])

        this.activateGear(this.gears[0])
        this.activateGear(this.gears[1])
      } else if (this.windSpeed > 10 && this.windSpeed <= 15) {
        this.stopGear(this.gears[3])
        this.stopGear(this.gears[4])

        this.activateGear(this.gears[0])
        this.activateGear(this.gears[1])
        this.activateGear(this.gears[2])
      } else if (this.windSpeed > 15 && this.windSpeed <= 20) {
        this.stopGear(this.gears[4])

        this.activateGear(this.gears[0])
        this.activateGear(this.gears[1])
        this.activateGear(this.gears[2])
        this.activateGear(this.gears[3])
      } else if (this.windSpeed > 20 && this.windSpeed <= 25) {
        this.activateGear(this.gears[0])
        this.activateGear(this.gears[1])
        this.activateGear(this.gears[2])
        this.activateGear(this.gears[3])
        this.activateGear(this.gears[4])
      }
    } else {
      this.stopGears()
    }
  }

  private activateGear(gear: Gear): void {
    if (!gear.active) {
      gear.active = true
      this.rotateGear(gear)
    }
  }

  private stopGears(): void {
    this.gears.forEach(gear => this.stopGear(gear))
  }

  private stopGear(gear: Gear): void {
    gear.active = false
  }

  public rotateGear(gear: Gear): void {
    this.svg
      .select(`.gear${gear.id}`)
      .selectAll('line')
      .transition()
      .ease(d3.easeLinear).duration(this.rotationDuration)
      .attrTween('transform', this.tween(gear.centerPoint))
      .on('end', () => gear.active && this.rotateGear(gear))
  }

  private tween(centerPoint: CenterPoint): () => (t: number) => string {
    return () => d3.interpolateString(
      `rotate(${this.startAngle},${centerPoint.cx},${centerPoint.cy})`,
      `rotate(${this.endAngle},${centerPoint.cx},${centerPoint.cy})`
    )
  }

}

type CogLine = { x1: number, y1: number, x2: number, y2: number }
type CenterPoint = { cx: number, cy: number }

class Gear {
  public active = false
  public readonly color = 'white'
  public readonly paddingOuterCircle1: number
  public rotateAngle: number
  private readonly distanceOuterCircles: number
  private readonly rOuter2Circle: number

  public constructor(public id: number,
                     public readonly centerPoint: CenterPoint,
                     public readonly rOuter1Circle: number) {

    this.distanceOuterCircles = this.rOuter1Circle * 0.4
    this.paddingOuterCircle1 = this.rOuter1Circle * 0.1
    this.rOuter2Circle = this.rOuter1Circle + this.distanceOuterCircles
    this.rotateAngle = -45
  }

  public generateLines(): CogLine[] {
    const cogsLinesDict = [{
      'x1': this.centerPoint.cx,
      'y1': this.centerPoint.cy - this.rOuter1Circle,
      'x2': this.centerPoint.cx,
      'y2': this.centerPoint.cy - this.rOuter1Circle - this.distanceOuterCircles
    }]
    for (let i = 0; i < 7; i++) {
      cogsLinesDict.push(this.getNewLine())
    }

    return cogsLinesDict
  }

  private getNewLine(): CogLine {
    const cosAngle = Math.cos(this.rotateAngle * (Math.PI / 180))
    const sinAngle = Math.sin(this.rotateAngle * (Math.PI / 180))

    const x1 = this.centerPoint.cx + cosAngle * this.rOuter1Circle
    const y1 = this.centerPoint.cy + sinAngle * this.rOuter1Circle

    const x2 = this.centerPoint.cx + cosAngle * this.rOuter2Circle
    const y2 = this.centerPoint.cy + sinAngle * this.rOuter2Circle

    this.rotateAngle = this.rotateAngle + 45

    return {
      "x1": Math.round(x1),
      "y1": Math.round(y1),
      "x2": Math.round(x2),
      "y2": Math.round(y2)
    }
  }
}
