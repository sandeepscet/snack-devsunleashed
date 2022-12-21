import React from "react";

import { render } from "react-dom";
import { invoke } from '@forge/bridge';


class App extends React.Component {
  state = {
    rows: []
  };

  
  componentDidMount() {
    invoke('getStorage', { key: 'config' }).then((returnedData) => {
        let initStat = [{
            type: "jql",
            ql: "issuetype = Story AND status = Done AND created >= -15d and assignee = currentUser() order by created DESC",
            noOfBlocks : 1,
            field : "created"  
          }];

        if(returnedData && Object.keys(returnedData).length > 0)
        {
            initStat = returnedData;             
        }
        this.setState({ rows: initStat });       
    });
  }

  handleChange = idx => e => {
    const { name, value } = e.target;
    const rows = [...this.state.rows];

    rows[idx][name] = value;
    
    this.setState({
      rows
    });
  };
  handleAddRow = () => {
    const item = {
      type: "jql",
      ql: "",
      noOfBlocks : 1,
      field : ""  
    };
    this.setState({
      rows: [...this.state.rows, item]
    });
  };

  handleRemoveSpecificRow = (idx) => () => {
    const rows = [...this.state.rows]
    rows.splice(idx, 1)
    this.setState({ rows })
  }

  onSubmitHandler = (e) => {
    e.preventDefault()
    invoke('setStorage', { key: 'config', value: this.state.rows }).then((returnedData) => {
        alert("Data has been Saved."); // TODO Replace with header bar
    }); 
   }


  render() {

    if (this.state.rows.length === 0) {
        return (<div><p>Loading...</p></div>)
    }

    return (
      <div>
         <form onSubmit={this.onSubmitHandler}>
        <div className="container">
          <div className="row clearfix">
            <div className="col-md-12 column">
              <table
                className="table table-bordered table-hover"
                id="tab_logic"
              >
                <thead>
                  <tr>
                    <th className="text-center"> # </th>
                    <th className="text-center"> Type </th>
                    <th className="text-center"> JQl/CQL </th>
                    <th className="text-center"> No of Blocks </th>
                    <th className="text-center"> Data Field </th>
                    <th />
                  </tr>
                </thead>
                <tbody>
                  {this.state.rows.map((item, idx) => (
                    <tr id="addr0" key={idx}>
                      <td>{idx}</td>
                      <td>
                      <select name="type"
                          value={this.state.rows[idx].type}
                          onChange={this.handleChange(idx)}
                          className="form-control" required>
                        <option value="jql" >JQL</option>
                        <option value="cql">CQL</option>
                      </select>                       
                      </td>
                      <td>
                        <input
                          type="text"
                          name="ql"
                          value={this.state.rows[idx].ql}
                          onChange={this.handleChange(idx)}
                          className="form-control"
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          max="3"
                          min="1"
                          name="noOfBlocks"
                          value={this.state.rows[idx].noOfBlocks}
                          onChange={this.handleChange(idx)}
                          className="form-control"
                          required
                        />
                      </td>
                      <td>
                        <input
                          type="text"
                          name="field"
                          value={this.state.rows[idx].field}
                          onChange={this.handleChange(idx)}
                          className="form-control"
                          required
                        />
                      </td>
                      <td>
                        <button
                          className="btn btn-outline-danger btn-sm"
                          onClick={this.handleRemoveSpecificRow(idx)}
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <button onClick={this.handleAddRow} className="btn btn-primary">
                Add Row
              </button>
              <button
                onSubmit={this.onSubmitHandler}
                type="submit"  className="btn btn-primary float-right">
                    Save
                </button>
            </div>
          </div>
        </div>
        </form>
      </div>
    );
  }
}

render(<App />, document.getElementById("root"));