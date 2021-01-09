import React from "react";
import Select from "react-select";
import axios from "axios";
import * as Constants from "./constants";
import ReactLoading from "react-loading";

import { BootstrapTable, TableHeaderColumn } from "react-bootstrap-table";
import "./styles.css";

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      results: [],
      dropDownValue: Constants.defaultDropdownValue,
      loading: true
    };
    this.fetchResponse = this.fetchResponse.bind(this);
  }

  onRowSelect = (row, isSelected) => {
    const key = this.state.dropDownValue.label + "Selected";
    let selected = JSON.parse(sessionStorage.getItem(key));
    if (selected) {
      const keyIndex = selected.indexOf(row.ifsc);
      if (keyIndex >= 0) {
        selected = [
          ...selected.slice(0, keyIndex),
          ...selected.slice(keyIndex + 1)
        ];
      } else {
        selected.push(row.ifsc);
      }
      sessionStorage.setItem(key, JSON.stringify(selected));
    } else {
      let newSelection = [];
      newSelection.push(row.ifsc);
      sessionStorage.setItem(key, JSON.stringify(newSelection));
    }
  };

  onSelectAll = (isSelected, rows) => {
    for (let i = 0; i < rows.length; i++) {
      this.onRowSelect(rows[i], isSelected);
    }
  };

  handleChange(dropDownValue) {
    console.log(dropDownValue.value);
    this.setState({ dropDownValue: dropDownValue, loading: true });
    this.fetchResponse(dropDownValue);
  }
  //
  fetchResponse(dropDownValue) {
    let hits = sessionStorage.getItem(dropDownValue.label);
    if (hits) {
      this.setState({ results: JSON.parse(hits), loading: false });
      console.log("session storage is called:" + dropDownValue.label);
    } else {
      axios  
        .get(
          "https://abhinandanfylechallenge.pythonanywhere.com/api/?format=json&search=" +
            dropDownValue.value
        )
        .then(res => {
          this.setState({ results: res.data, loading: false });
          sessionStorage.setItem(dropDownValue.label, JSON.stringify(res.data));
        });
    }
  }

  componentDidMount() {
    console.log("component did mount");
    this.fetchResponse({ label: "Mumbai", value: "MUMBAI" });
  }
  
  render() {
    const { onRowSelect, onSelectAll } = this;
    const { results, dropDownValue, loading } = this.state;
    const key = dropDownValue.label + "Selected";

    const selectRowProp = {
      mode: "checkbox",
      onSelect: onRowSelect,
      onSelectAll: onSelectAll,
      selected: JSON.parse(sessionStorage.getItem(key)),
      bgColor: "#1b995a"
    };

    const table = (
      <BootstrapTable
        search
        searchPlaceholder="Find"
        pagination
        data={results}
        hover={true}
        version="4"
        selectRow={selectRowProp}
      >
        <TableHeaderColumn dataField="ifsc" isKey>
          IFSC CODE
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="bank_id"
          dataAlign="center"
          tdStyle={{ whiteSpace: "normal", wordWrap: "break-word" }}
        >
          BANK ID
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="bank_name"
          tdStyle={{ whiteSpace: "normal", wordWrap: "break-word" }}
        >
          BANK_NAME
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="branch"
          dataAlign="center"
          tdStyle={{ whiteSpace: "normal", wordWrap: "break-word" }}
        >
          BRANCH
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="address"
          dataAlign="center"
          width="20%"
          tdStyle={{ whiteSpace: "normal", wordWrap: "break-word" }}
        >
          ADDRESS
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="city"
          dataAlign="center"
          tdStyle={{ whiteSpace: "normal", wordWrap: "break-word" }}
        >
          CITY
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="district"
          tdStyle={{ whiteSpace: "normal", wordWrap: "break-word" }}
        >
          DISTRICT
        </TableHeaderColumn>
        <TableHeaderColumn
          dataField="state"
          tdStyle={{ whiteSpace: "normal", wordWrap: "break-word" }}
        >
          STATE
        </TableHeaderColumn>
        
      </BootstrapTable>
    );
    return (
      <div class="row" className="hdr">
        <div style={{ backgroundColor: "#1b995a"}} class="col-sm-12 btn btn-info">
          <h1 style={{ padding: "10px 20px", textAlign: "center", color: "white"}}> Abhinandan's Bank Search Application </h1>
        </div>
        <br/><br/><br/>
        <div style={{ backgroundColor: "#1b995a", width: "300px"}}>
          <Select
            options={Constants.options}
            value={this.state.value}
            autosize={true}
            onChange={value => this.handleChange(value)}
            defaultValue={Constants.defaultDropdownValue}
          />
        </div>
        {loading ? (
          <ReactLoading
            
          />
        ) : (
          table
        )}
      </div>
    );
  }
}
