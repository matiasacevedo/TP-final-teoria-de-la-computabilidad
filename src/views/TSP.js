import React from "react";
// react plugin used to create charts
import { Line, Pie } from "react-chartjs-2";

import {
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  CardTitle,
  Row,
  Col,
} from "reactstrap";

import{
  nodos4 as cities4,
  nodos6 as cities6,
  nodos8 as cities8,
  nodos10 as cities10,
  nodos30 as cities30
} from "datasource/datasource.json"

class TSP extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
        labelsGraphic:["0", "4", "6", "8", "10", "30"],
        timesRuning: [0, 0, 0, 0, 0, 0],
        timesTSP: {nodos4: 0, nodos6: 0, nodos8: 0, nodos10: 0, nodos30: 0},
        timesTSPH: {nodos4: 0, nodos6: 0, nodos8: 0, nodos10: 0, nodos30: 0},
        datasetNum4: 1, //nodos4
        datasetNum6: 2, //nodos6
        datasetNum8: 3, //nodos8
        datasetNum10: 4, //nodos10
        datasetNum30: 5, //nodos30
        routeSelected4:{RouteSelected : "", DistanceSelected : 0},
        routeSelected6:{RouteSelected : "", DistanceSelected : 0},
        routeSelected8:{RouteSelected : "", DistanceSelected : 0},
        routeSelected10:{RouteSelected : "", DistanceSelected : 0},
        routeSelected4H:{RouteSelected : "", DistanceSelected : 0},
        routeSelected6H:{RouteSelected : "", DistanceSelected : 0},
        routeSelected8H:{RouteSelected : "", DistanceSelected : 0},
        routeSelected10H:{RouteSelected : "", DistanceSelected : 0},
        routeSelected30H:{RouteSelected : "", DistanceSelected : 0}
      }
    
    this.calcularTSP = this.calcularTSP.bind(this)
    this.GetDataToGraphic = this.GetDataToGraphic.bind(this)
    this.calcularTSPHeuristico = this.calcularTSPHeuristico.bind(this)
    this.convertMillisecondsToDigitalClock = this.convertMillisecondsToDigitalClock.bind(this)
    this.SetTimeRun = this.SetTimeRun.bind(this)
    this.SetTimeRunHeur = this.SetTimeRunHeur.bind(this)
    
  }

////////////   TSP //////////////
  calcularTSP(cities) {

    var nodeInitial = {}
    var neighbors = []

    const permutator = (inputArr) => {
      let result = [];

      const permute = (arr, m = []) => {
          if (arr.length === 0) {
              result.push(m)
          } else {
              for (let i = 0; i < arr.length; i++) {
                  let curr = arr.slice();
                  let next = curr.splice(i, 1);
                  permute(curr, m.concat(next))
              }
          }
      }

      permute(inputArr)
      return result;
    }

    for (var city in cities){
      if (cities[city].inicial) {
        nodeInitial = cities[city]
      }
      else{
        neighbors.push(cities[city])
      }
    }  
    
    //console.log(permutator(neighbors));
    var convinationsNodes = permutator(neighbors)
    var totalDistance = 0
    var objRoute = []
    var distanceSelected = 0
    var routeSelected = {}

    for (var node in convinationsNodes){

      var route = convinationsNodes[node]

      var beforeNodeName = nodeInitial.nombre

      for (var n in route){

        totalDistance += route[n].vecinos[beforeNodeName]?.distancia

        //si es el ultimo vecino pasa al inicial
        if (route[route.length - 1].nombre == route[n].nombre) {
          beforeNodeName = nodeInitial.nombre
          totalDistance += route[n].vecinos[beforeNodeName]?.distancia
          
          objRoute = []
          objRoute.push(nodeInitial)
          objRoute.push(...route)
          objRoute.push(nodeInitial)
          //console.log(objRoute)

          if (distanceSelected == 0) {
            distanceSelected = totalDistance
            routeSelected = objRoute
          }
          else if (totalDistance <= distanceSelected){
            distanceSelected = totalDistance
            routeSelected = objRoute
          }

        }
        else{
          beforeNodeName = route[n].nombre        
        }

      }

      totalDistance = 0

    }


    console.log("Ruta mas corta seleccionada")
    console.log(routeSelected)

    var routeString = ""
    for (var line in routeSelected){
      routeString += " " + routeSelected[line].nombre
    }

    if (Object.keys(cities).length == 4) {  
        this.setState({
          routeSelected4 : {RouteSelected : routeString, DistanceSelected : distanceSelected}
        })
    }
    else if (Object.keys(cities).length == 6) {
        this.setState({
          routeSelected6 : {RouteSelected : routeString, DistanceSelected : distanceSelected}     
        })
    }
    else if (Object.keys(cities).length == 8) {
        this.setState({
          routeSelected8 : {RouteSelected : routeString, DistanceSelected : distanceSelected}
        })
    }    
    else if (Object.keys(cities).length == 10) {
      this.setState({
        routeSelected10 : {RouteSelected : routeString, DistanceSelected : distanceSelected}
    })
  }
}

////////////   TSP HEURISTICO  //////////////
  calcularTSPHeuristico(cities) {

    var endRoute = false
    var nodeInitial = null
    var nextNode = null
    var nodesSeen = []
    var distanceSelected = 0

    const GetNextNode = (obj = []) => {
      var dist = 0
      var nodeName = ""
      Object.keys(obj).forEach(function(key) {

        if (dist == 0 && !nodesSeen.includes(obj[key].nombre)) {
          dist = obj[key].distancia
          nodeName = obj[key].nombre
        }
        else if (obj[key].distancia <= dist && !nodesSeen.includes(obj[key].nombre)){
          dist = obj[key].distancia
          nodeName = obj[key].nombre
        }

      });
      
      return {nombre: nodeName, distancia: dist}

    }

    while(!endRoute) {

      Object.keys(cities).forEach(function(key) {

        if (cities[key].inicial && nodeInitial == null) {
          nodeInitial = cities[key]
          nextNode = GetNextNode(cities[key].vecinos)
          nodesSeen.push(nodeInitial.nombre)
          nodesSeen.push(nextNode.nombre)
          distanceSelected += nextNode.distancia
        }

        if (nextNode.nombre === cities[key].nombre) {
          if (nodesSeen.length < Object.keys(cities).length) {
            nextNode = GetNextNode(cities[key].vecinos)
            distanceSelected += nextNode.distancia
            nodesSeen.push(nextNode.nombre)         
          }
          else if (nodesSeen.length == Object.keys(cities).length) {
            nodesSeen.push(nodeInitial.nombre)
            Object.keys(nodeInitial.vecinos).forEach(function(i) {
              if (nodeInitial.vecinos[i].nombre == nextNode.nombre){
                  distanceSelected += nodeInitial.vecinos[i].distancia
              }
            });

            endRoute = true
            
          }   
        }
      });
    }

    if (Object.keys(cities).length == 4) {  
      this.setState({
        routeSelected4H : {RouteSelected : nodesSeen.toString(), DistanceSelected : distanceSelected}
      })
    }
    else if (Object.keys(cities).length == 6) {
        this.setState({
          routeSelected6H : {RouteSelected : nodesSeen.toString(), DistanceSelected : distanceSelected}     
        })
    }
    else if (Object.keys(cities).length == 8) {
        this.setState({
          routeSelected8H : {RouteSelected : nodesSeen.toString(), DistanceSelected : distanceSelected}
        })
    }
    else if (Object.keys(cities).length == 10) {
      this.setState({
        routeSelected10H : {RouteSelected : nodesSeen.toString(), DistanceSelected : distanceSelected}
      })
    }
    else if (Object.keys(cities).length == 30) {
      this.setState({
        routeSelected30H : {RouteSelected : nodesSeen.toString(), DistanceSelected : distanceSelected}
      })
    }
} 

  GetDataToGraphic(){
    const dashboardChart = {
      data: (canvas) => {
        return {
          labels: this.state.labelsGraphic,
          datasets: [
            {
              borderColor: "#6DE0E1",
              backgroundColor: "#6DE0E1",
              pointRadius: 0,
              pointHoverRadius: 0,
              borderWidth: 3,
              data: this.state.timesRuning,
            }
          ],
        };
      },
      options: {
        legend: {
          display: false,
        },
    
        tooltips: {
          enabled: false,
        },
    
        scales: {
          yAxes: [
            {
              ticks: {
                fontColor: "#9f9f9f",
                beginAtZero: false,
                maxTicksLimit: 5,
                //padding: 20
              },
              gridLines: {
                drawBorder: false,
                zeroLineColor: "#ccc",
                color: "rgba(255,255,255,0.05)",
              },
            },
          ],
    
          xAxes: [
            {
              barPercentage: 1.6,
              gridLines: {
                drawBorder: false,
                color: "rgba(255,255,255,0.1)",
                zeroLineColor: "transparent",
                display: false,
              },
              ticks: {
                padding: 20,
                fontColor: "#9f9f9f",
              },
            },
          ],
        },
      },
    };

    return dashboardChart
  }

  convertMillisecondsToDigitalClock(ms) {
    return ms / 1000 // 1 Second = 1000 Milliseconds
  }

  SetTimeRun(times){
    this.setState({
      //timesRuningNoHeur : times,
      timesRuning : times
    })

    console.log("LOG")
    console.log(this.timesRuning)
  }

  SetTimeRunHeur(times){
    this.setState({
      timesRuning : times,
      //timesRuningHeur : times
    })



  }


  render() {
    return (
      <>

      <div className="content">

        <div>
          <button href="#" className="btn btn-primary btn-lg active" role="button" aria-pressed="true" onClick={() => {
                  
                  var times = [0, 0, 0, 0, 0]
                  console.log("----------------ÓPTIMO----------------")

                  console.log("-------------30 nodos--------------")
                  console.log(`Para 10 nodos tarda 8.1181059e+29 milisegundos.`);
                  times[this.state.datasetNum30] = 8.1181059e+29
                  this.state.timesTSP.nodos30 = times[this.state.datasetNum30]

                  //nodes10
                  console.log("-------------10 nodos--------------")
                  var t6 = performance.now();
                  this.calcularTSP(cities10)
                  var t7 = performance.now();
                  var currentTime = (t7 - t6)
                  console.log(`Para 10 nodos tarda ${currentTime} milisegundos.`);
                  times[this.state.datasetNum10] = currentTime
                  this.state.timesTSP.nodos10 = times[this.state.datasetNum10]

                  //nodes8
                  console.log("-------------8 nodos--------------")
                  var t4 = performance.now();
                  this.calcularTSP(cities8)
                  var t5 = performance.now();
                  currentTime = (t5 - t4)
                  console.log(`Para 8 nodos tarda ${currentTime} milisegundos.`);
                  times[this.state.datasetNum8] = currentTime
                  this.state.timesTSP.nodos8 = times[this.state.datasetNum8]

                  //nodes6
                  console.log("-------------6 nodos--------------")
                  var t2 = performance.now();
                  this.calcularTSP(cities6)
                  var t3 = performance.now();
                  currentTime = (t3 - t2)
                  console.log(`Para 6 nodos tarda ${currentTime} milisegundos.`);
                  times[this.state.datasetNum6] = currentTime
                  this.state.timesTSP.nodos6 = times[this.state.datasetNum6]


                  //nodes4
                  console.log("-------------4 nodos--------------")
                  var t0 = performance.now();
                  this.calcularTSP(cities4)
                  var t1 = performance.now();
                  currentTime = (t1 - t0)
                  console.log(`Para 4 nodos tarda: ${currentTime} milisegundos.`);
                  times[this.state.datasetNum4] = currentTime
                  this.state.timesTSP.nodos4 = times[this.state.datasetNum4]

                  this.setState({
                    timesRuning : times
                  })

                  console.log(this.state.timesRuning)


              }} >TSP
          </button>

          <button href="#" className="btn btn-primary btn-lg active" role="button" aria-pressed="true" onClick={() => {

                  var times = [0, 0, 0, 0, 0]
                  console.log("----------------HEURÌSTICO----------------")

                  //nodes30
                  console.log("-------------30 nodos--------------")
                  var t8 = performance.now();
                  this.calcularTSPHeuristico(cities30)
                  var t9 = performance.now();
                  var currentTime = this.convertMillisecondsToDigitalClock(t9 - t8)
                  console.log(`Para 30 nodos tarda ${currentTime} milisegundos.`);
                  times[this.state.datasetNum30] = currentTime
                  this.state.timesTSPH.nodos30 = times[this.state.datasetNum30]

                  //nodes10
                  console.log("-------------10 nodos--------------")
                  var t6 = performance.now();
                  this.calcularTSPHeuristico(cities10)
                  var t7 = performance.now();
                  var currentTime = this.convertMillisecondsToDigitalClock(t7 - t6)
                  console.log(`Para 10 nodos tarda ${currentTime} milisegundos.`);
                  times[this.state.datasetNum10] = currentTime
                  this.state.timesTSPH.nodos10 = times[this.state.datasetNum10]

                  //nodes8
                  console.log("-------------8 nodos--------------")
                  var t4 = performance.now();
                  this.calcularTSPHeuristico(cities8)
                  var t5 = performance.now();
                  currentTime = this.convertMillisecondsToDigitalClock(t5 - t4)
                  console.log(`Para 8 nodos tarda ${currentTime} milisegundos.`);
                  times[this.state.datasetNum8] = currentTime
                  this.state.timesTSPH.nodos8 = times[this.state.datasetNum8]

                  //nodes6
                  console.log("-------------6 nodos--------------")
                  var t2 = performance.now();
                  this.calcularTSPHeuristico(cities6)
                  var t3 = performance.now();
                  currentTime = this.convertMillisecondsToDigitalClock(t3 - t2) 
                  console.log(`Para 6 nodos tarda ${currentTime} milisegundos.`);
                  times[this.state.datasetNum6] = currentTime
                  this.state.timesTSPH.nodos6 = times[this.state.datasetNum6]


                  //nodes4
                  console.log("-------------4 nodos--------------")
                  var t0 = performance.now();
                  this.calcularTSPHeuristico(cities4)
                  var t1 = performance.now();
                  currentTime = this.convertMillisecondsToDigitalClock(t1 - t0)
                  console.log(`Para 4 nodos tarda: ${currentTime} milisegundos.`);
                  times[this.state.datasetNum4] = currentTime
                  this.state.timesTSPH.nodos4 = times[this.state.datasetNum4]

                  this.setState({
                    timesRuning : times
                  })
                  
                  console.log(this.state.timesRuning)

          
          }}>Solución Heurística
          </button>

        </div>

        <Row>
          <Col md="12">
            <Card>
              <CardHeader>
                <CardTitle tag="h5">Temporización en milisegundos</CardTitle>
              </CardHeader>
              <CardBody>
                <Line                
                  data={this.GetDataToGraphic().data}
                  options={this.GetDataToGraphic().options}
                  width={400}
                  height={100}
                />
              </CardBody>
              <CardFooter>
                <hr />
                <div className="stats">
                  <i className="fa fa-history" /> Updated 3 minutes ago
                </div>
              </CardFooter>
            </Card>
          </Col>
        </Row>

        <div>
          <blockquote className="blockquote">
            <p > <font size="5" color="#28C8CA"> 4 NODOS </font> </p> 
            <div >
              <div className="row">
                <div className="col-4">
                  <p>Óptimo</p> 
                  <footer className="blockquote-footer">Ruta mas corta seleccionada: {this.state.routeSelected4.RouteSelected} </footer> 
                  <footer className="blockquote-footer">Distancia: {this.state.routeSelected4.DistanceSelected} </footer>
                  <footer className="blockquote-footer">Tiempo: {this.state.timesTSP.nodos4} </footer>
                </div>

                <div className="col-4">
                  <p>Heurístico</p>
                  <footer className="blockquote-footer">Ruta mas corta seleccionada: {this.state.routeSelected4H.RouteSelected} </footer> 
                  <footer className="blockquote-footer">Distancia: {this.state.routeSelected4H.DistanceSelected} </footer>
                  <footer className="blockquote-footer">Tiempo: {this.state.timesTSPH.nodos4} </footer>         
                </div>
              </div>

            </div>


          </blockquote>

          <blockquote className="blockquote">
            <p > <font size="5" color="#28C8CA"> 6 NODOS </font> </p> 
            <div >
              <div className="row">
                <div className="col-4">
                  <p>Óptimo</p> 
                  <footer className="blockquote-footer">Ruta mas corta seleccionada: {this.state.routeSelected6.RouteSelected} </footer> 
                  <footer className="blockquote-footer">Distancia: {this.state.routeSelected6.DistanceSelected} </footer>
                  <footer className="blockquote-footer">Tiempo: {this.state.timesTSP.nodos6} </footer>
                </div>

                <div className="col-4">
                  <p>Heurístico</p> 
                  <footer className="blockquote-footer">Ruta mas corta seleccionada: {this.state.routeSelected6H.RouteSelected} </footer> 
                  <footer className="blockquote-footer">Distancia: {this.state.routeSelected6H.DistanceSelected} </footer>
                  <footer className="blockquote-footer">Tiempo: {this.state.timesTSPH.nodos6} </footer>
                </div>
              </div>
            </div>
          </blockquote>

          <blockquote className="blockquote">
            <p > <font size="5" color="#28C8CA"> 8 NODOS </font> </p> 
            <div >
              <div className="row">
                <div className="col-4">
                  <p>Óptimo</p> 
                  <footer className="blockquote-footer">Ruta mas corta seleccionada: {this.state.routeSelected8.RouteSelected} </footer> 
                  <footer className="blockquote-footer">Distancia: {this.state.routeSelected8.DistanceSelected} </footer>
                  <footer className="blockquote-footer">Tiempo: {this.state.timesTSP.nodos8} </footer>
                </div>

                <div className="col-4">      
                  <p>Heurístico</p> 
                  <footer className="blockquote-footer">Ruta mas corta seleccionada: {this.state.routeSelected8H.RouteSelected} </footer> 
                  <footer className="blockquote-footer">Distancia: {this.state.routeSelected8H.DistanceSelected} </footer>
                  <footer className="blockquote-footer">Tiempo: {this.state.timesTSPH.nodos8} </footer>
                </div>
              </div>
            </div>
          </blockquote>

          <blockquote className="blockquote">
            <p > <font size="5" color="#28C8CA"> 10 NODOS </font> </p>
            <div >
              <div className="row">
                <div className="col-4"> 
                  <p>Óptimo</p> 
                  <footer className="blockquote-footer">Ruta mas corta seleccionada: {this.state.routeSelected10.RouteSelected} </footer> 
                  <footer className="blockquote-footer">Distancia: {this.state.routeSelected10.DistanceSelected} </footer>
                  <footer className="blockquote-footer">Tiempo: {this.state.timesTSP.nodos10} </footer>
                </div>

                <div className="col-4">          
                  <p>Heurístico</p> 
                  <footer className="blockquote-footer">Ruta mas corta seleccionada: {this.state.routeSelected10H.RouteSelected} </footer> 
                  <footer className="blockquote-footer">Distancia: {this.state.routeSelected10H.DistanceSelected} </footer>
                  <footer className="blockquote-footer">Tiempo: {this.state.timesTSPH.nodos10} </footer>
                  </div>
              </div>
            </div>
          </blockquote>

          <blockquote className="blockquote">
            <p > <font size="5" color="#28C8CA"> 30 NODOS </font> </p>
            <div >
              <div className="row">
                <div className="col-4"> 
                  <p>Óptimo</p> 
                  <footer className="blockquote-footer">Ruta mas corta seleccionada: {} </footer> 
                  <footer className="blockquote-footer">Distancia: {} </footer>
                  <footer className="blockquote-footer">Tiempo: {this.state.timesTSP.nodos30} </footer>
                </div>

                <div className="col-4">          
                  <p>Heurístico</p> 
                  <footer className="blockquote-footer">Ruta mas corta seleccionada: {this.state.routeSelected30H.RouteSelected} </footer> 
                  <footer className="blockquote-footer">Distancia: {this.state.routeSelected30H.DistanceSelected} </footer>
                  <footer className="blockquote-footer">Tiempo: {this.state.timesTSPH.nodos30} </footer>
                  </div>
              </div>
            </div>
          </blockquote>



        </div>


      </div>
      </>
    );
  }



}

export default TSP;
