import { Line } from "react-chartjs-2";

import React from "react";

// reactstrap components
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
  G1 as G1,
  G2 as G2,
  G3 as G3,
  G4 as G4,
  nodos30 as cities30
} from "datasource/datasource.json"

class CircuitoHamiltoniano extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
        routes:[],
        labelsGraphic:["0", "3", "5", "6", "8"],
        timesRuning: [0, 0, 0, 0],
        G1Index: 1,
        G2Index: 2,
        G3Index: 3,
        G4Index: 4,
        G1DataH:{IsHamiltonianCircuit : "", Route : "", tiempo: 0},
        G2DataH:{IsHamiltonianCircuit : "", Route : "", tiempo: 0},
        G3DataH:{IsHamiltonianCircuit : "", Route : "", tiempo: 0},
        G4DataH:{IsHamiltonianCircuit : "", Route : "", tiempo: 0},

        G1Data:{IsHamiltonianCircuit : "", Route : "", tiempo: 0},
        G2Data:{IsHamiltonianCircuit : "", Route : "", tiempo: 0},
        G3Data:{IsHamiltonianCircuit : "", Route : "", tiempo: 0},
        G4Data:{IsHamiltonianCircuit : "", Route : "", tiempo: 0}
    }

    this.IsHamiltonianCircuitHeuristico = this.IsHamiltonianCircuitHeuristico.bind(this)
    this.IsHamiltonianCircuit = this.IsHamiltonianCircuit.bind(this)
    this.SetTimeRun = this.SetTimeRun.bind(this)

  }

  permutator = (inputArr, isPar) => {
    let result = [];

    const permute = (arr, m = []) => {
        if (arr.length === 0) {
            if (isPar) {
              result.push(m.splice(m.length - 2, m.length))  
            }
            else{
              result.push(m)
            }
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


  IsHamiltonianCircuit(graphic){

    const insertLetterToList = (letter, list) => {
      if (!list.includes(letter)) {
        list.push(letter)
      }

      return list
    }

    var nodes = []
    for (var node in graphic){
      nodes.push(graphic[node])
    }

    var convinationsVer = this.permutator(nodes, false)
    var routeSelected = []

    //console.log(convinationsVer)

    Object.keys(convinationsVer).forEach(function(i) {
      var route = []
      var beforeNode = null
      var nodesConv = convinationsVer[i]

      //console.log(nodesConv)

      Object.keys(nodesConv).forEach(function(z) {

        if (z == 0) {
          beforeNode = nodesConv[z]
          route.push(nodesConv[z].nombre)
        }

        if (z > 0) {
          if (beforeNode.vertices.includes(nodesConv[z].nombre)) {
            insertLetterToList(nodesConv[z].nombre, route)
          }          
        }        
          
        beforeNode = nodesConv[z]

        if (route.length == nodesConv.length && nodesConv[z].vertices.includes(nodesConv[0].nombre)) {
          routeSelected = route
          routeSelected.push(nodesConv[0].nombre)
        }

      });

      

    });



    if (routeSelected.length > 1) {
      return {IsHamiltonianCircuit : "Si", Route : routeSelected.toString(), tiempo: 0}
    }
    else{
      return {IsHamiltonianCircuit : "No", Route : "", tiempo: 0}
    }


  }



  IsHamiltonianCircuitHeuristico(graphic){

    var route = []
    const SetNode = (node) =>{
      if (!route.includes(node)) {
        route.push(node)
      }
    }


    var nodes = []
    for (var node in graphic){
      nodes.push(graphic[node])
    }

    var convinationsVer = this.permutator(nodes, true)
    var n = Object.keys(graphic).length
    var countMatchs = 0

    //console.log(convinationsVer)

    Object.keys(convinationsVer).forEach(function(i) {
        var ver = []
        var index = 0
        Object.keys(convinationsVer[i]).forEach(function(z) {
          ver[index] = convinationsVer[i][z].vertices.length
          SetNode(convinationsVer[i][z].nombre)
          index += 1
      });

      if (ver[0] + ver[1] >= n) {
        countMatchs += 1
      }

    });


    if (countMatchs == Object.keys(convinationsVer).length) {
      route.push(route[0].toString())
      return {IsHamiltonianCircuit : "Si", Route : route.toString(), tiempo: 0}
    }
    else{
      return {IsHamiltonianCircuit : "No", Route : "", tiempo: 0}
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

  SetTimeRun(times){
    this.setState({
      timesRuning : times
    })
  }

  render() {
    return (
      <>

      <div className="content">

        <div>
          <button href="#" className="btn btn-primary btn-lg active" role="button" aria-pressed="true" onClick={() => {
            var times = [0, 0, 0, 0]

            //Grafico 1
            console.log("----------------ÓPTIMO----------------")
            console.log("-------------Grafico 1--------------")
            var t0 = performance.now();
            var data = this.IsHamiltonianCircuit(G1)
            var t1 = performance.now();
            var currentTime = t1 - t0
            console.log(`Para el grafico 1 tarda ${currentTime} milisegundos.`);
            times[this.state.G1Index] = currentTime          
            data.tiempo = currentTime
            this.setState({
              G1Data : data
            })

            this.state.G1Data.tiempo = currentTime
            console.log(this.state.timesRuning)

            //Grafico 2
            console.log("-------------Grafico 2--------------")
            var t2 = performance.now();
            data = this.IsHamiltonianCircuit(G2)
            var t3 = performance.now();
            var currentTime = t3 - t2
            console.log(`Para el grafico 2 tarda ${currentTime} milisegundos.`);
            times[this.state.G2Index] = currentTime
            data.tiempo = currentTime
            this.setState({
              G2Data : data
            })
            console.log(this.state.timesRuning)


            //Grafico 3
            console.log("-------------Grafico 3--------------")
            var t4 = performance.now();
            data = this.IsHamiltonianCircuit(G3)
            var t5 = performance.now();
            var currentTime = t5 - t4
            console.log(`Para el grafico 3 tarda ${currentTime} milisegundos.`);
            times[this.state.G3Index] = currentTime
            data.tiempo = currentTime
            this.setState({
              G3Data : data
            })
            console.log(this.state.timesRuning)

            //Grafico 4
            console.log("-------------Grafico 4--------------")
            var t6 = performance.now();
            data = this.IsHamiltonianCircuit(G4)
            var t7 = performance.now();
            var currentTime = t7 - t6
            console.log(`Para el grafico 4 tarda ${currentTime} milisegundos.`);
            times[this.state.G4Index] = currentTime
            data.tiempo = currentTime
            this.setState({
              G4Data : data
            })
            console.log(this.state.timesRuning)

            this.SetTimeRun(times)


            
          }} >Circuito hamiltoniano</button>



          <button href="#" className="btn btn-primary btn-lg active" role="button" aria-pressed="true" onClick={() => {
          
            console.log("----------------HEURÌSTICO----------------")

            var times = [0, 0, 0, 0]
              
            //Grafico 1
            console.log("-------------Grafico 1--------------")
            var t0 = performance.now();
            var data = this.IsHamiltonianCircuitHeuristico(G1)
            var t1 = performance.now();
            var currentTime = t1 - t0
            console.log(`Para el grafico 1 tarda ${currentTime} milisegundos.`);
            times[this.state.G1Index] = currentTime          
            data.tiempo = currentTime
            this.setState({
              G1DataH : data
            })

            this.state.G1DataH.tiempo = currentTime
            console.log(this.state.timesRuning)



            //Grafico 2
            console.log("-------------Grafico 2--------------")
            var t2 = performance.now();
            data = this.IsHamiltonianCircuitHeuristico(G2)
            var t3 = performance.now();
            var currentTime = t3 - t2
            console.log(`Para el grafico 2 tarda ${currentTime} milisegundos.`);
            times[this.state.G2Index] = currentTime
            data.tiempo = currentTime
            this.setState({
              G2DataH : data
            })
            console.log(this.state.timesRuning)


            //Grafico 3
            console.log("-------------Grafico 3--------------")
            var t4 = performance.now();
            data = this.IsHamiltonianCircuitHeuristico(G3)
            var t5 = performance.now();
            var currentTime = t5 - t4
            console.log(`Para el grafico 3 tarda ${currentTime} milisegundos.`);
            times[this.state.G3Index] = currentTime
            data.tiempo = currentTime
            this.setState({
              G3DataH : data
            })
            console.log(this.state.timesRuning)

            //Grafico 4
            console.log("-------------Grafico 4--------------")
            var t6 = performance.now();
            data = this.IsHamiltonianCircuitHeuristico(G4)
            var t7 = performance.now();
            var currentTime = t7 - t6
            console.log(`Para el grafico 4 tarda ${currentTime} milisegundos.`);
            times[this.state.G4Index] = currentTime
            data.tiempo = currentTime
            this.setState({
              G4DataH : data
            })
            console.log(this.state.timesRuning)

            this.SetTimeRun(times)

          
          }} >Solución Heurística </button>


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
            <p > <font size="5" color="#28C8CA"> Grafico 1 </font> </p> 
            <div >
              <div className="row">
                <div className="col-4">
                  <p>Óptimo</p> 
                  <footer className="blockquote-footer">Es un Circuito Hamiltoniano: {this.state.G1Data.IsHamiltonianCircuit} </footer> 
                  <footer className="blockquote-footer">Ruta del circuito: {this.state.G1Data.Route} </footer> 
                  <footer className="blockquote-footer">Tiempo: {this.state.G1Data.tiempo} </footer>
                </div>

                <div className="col-4">
                  <p>Heurístico</p> 
                  <footer className="blockquote-footer">Es un Circuito Hamiltoniano: {this.state.G1DataH.IsHamiltonianCircuit} </footer> 
                  <footer className="blockquote-footer">Ruta del circuito: {this.state.G1DataH.Route} </footer> 
                  <footer className="blockquote-footer">Tiempo: {this.state.G1DataH.tiempo} </footer>
                </div>
              </div>
            </div>
          </blockquote>

          <blockquote className="blockquote">
            <p > <font size="5" color="#28C8CA"> Grafico 2 </font> </p>
            <div >
              <div className="row">
                <div className="col-4">
                  <p>Óptimo</p> 
                  <footer className="blockquote-footer">Es un Circuito Hamiltoniano: {this.state.G2Data.IsHamiltonianCircuit} </footer> 
                  <footer className="blockquote-footer">Ruta del circuito: {this.state.G2Data.Route} </footer> 
                  <footer className="blockquote-footer">Tiempo: {this.state.G2Data.tiempo} </footer>
                </div>

                <div className="col-4">
                  <p>Heurístico</p> 
                  <footer className="blockquote-footer">Es un Circuito Hamiltoniano: {this.state.G2DataH.IsHamiltonianCircuit} </footer> 
                  <footer className="blockquote-footer">Ruta del circuito: {this.state.G2DataH.Route} </footer> 
                  <footer className="blockquote-footer">Tiempo: {this.state.G2DataH.tiempo} </footer>
                </div>
              </div>
            </div>
          </blockquote>

          <blockquote className="blockquote">
            <p > <font size="5" color="#28C8CA"> Grafico 3 </font> </p>
            <div >
              <div className="row">
                <div className="col-4">
                  <p>Óptimo</p> 
                  <footer className="blockquote-footer">Es un Circuito Hamiltoniano: {this.state.G3Data.IsHamiltonianCircuit} </footer> 
                  <footer className="blockquote-footer">Ruta del circuito: {this.state.G3Data.Route} </footer> 
                  <footer className="blockquote-footer">Tiempo: {this.state.G3Data.tiempo} </footer>
                </div>

                <div className="col-4">
                  <p>Heurístico</p> 
                  <footer className="blockquote-footer">Es un Circuito Hamiltoniano: {this.state.G3DataH.IsHamiltonianCircuit} </footer> 
                  <footer className="blockquote-footer">Ruta del circuito: {this.state.G3DataH.Route} </footer> 
                  <footer className="blockquote-footer">Tiempo: {this.state.G3DataH.tiempo} </footer>
                </div>
              </div>
            </div>
          </blockquote>

          <blockquote className="blockquote">
            <p > <font size="5" color="#28C8CA"> Grafico 4 </font> </p>
            <div >
              <div className="row">
                <div className="col-4">
                  <p>Óptimo</p> 
                  <footer className="blockquote-footer">Es un Circuito Hamiltoniano: {this.state.G4Data.IsHamiltonianCircuit} </footer> 
                  <footer className="blockquote-footer">Ruta del circuito: {this.state.G4Data.Route} </footer> 
                  <footer className="blockquote-footer">Tiempo: {this.state.G4Data.tiempo} </footer>
                 </div>

                <div className="col-4">
                  <p>Heurístico</p> 
                  <footer className="blockquote-footer">Es un Circuito Hamiltoniano: {this.state.G4DataH.IsHamiltonianCircuit} </footer> 
                  <footer className="blockquote-footer">Ruta del circuito: {this.state.G4DataH.Route} </footer> 
                  <footer className="blockquote-footer">Tiempo: {this.state.G4DataH.tiempo} </footer>
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

export default CircuitoHamiltoniano;
