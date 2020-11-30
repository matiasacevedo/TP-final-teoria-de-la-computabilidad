/*!

=========================================================
* Paper Dashboard React - v1.2.0
=========================================================

* Product Page: https://www.creative-tim.com/product/paper-dashboard-react
* Copyright 2020 Creative Tim (https://www.creative-tim.com)

* Licensed under MIT (https://github.com/creativetimofficial/paper-dashboard-react/blob/master/LICENSE.md)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/
import Dashboard from "views/TSP.js";
import UserPage from "views/CircuitoHamiltoniano.js";

var routes = [
  {
    path: "/TSP",
    name: "TSP",
    icon: "nc-icon nc-chart-bar-32",
    component: Dashboard,
    layout: "/admin",
  },
  {
    path: "/CircuitoHamiltoniano",
    name: "Circuito Hamiltoniano",
    icon: "nc-icon nc-chart-bar-32",
    component: UserPage,
    layout: "/admin"
  }
];
export default routes;
