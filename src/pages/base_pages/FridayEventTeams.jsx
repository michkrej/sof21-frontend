import React, { Component } from "react"

import { Grid, GridCell, GridInner } from "@rmwc/grid"
import FormTextInput from "../../components/forms/components/FormTextInput"
import Button from "@rmwc/button"

import { info } from "../../constants"

const teams = [
  { name: "test", link: "/#" },
  { name: "test", link: "/#" },
  { name: "test", link: "/#" },
  { name: "test", link: "/#" },
  { name: "test", link: "/#" },
]

class FridayEventTeams extends Component {
  constructor(props) {
    super()
    this.state = {
      code: "",
      open: false,
    }
  }

  static pageTitle() {
    return "Lag"
  }

  static pageNavTitle() {
    return "Lag"
  }

  render() {
    return (
      <React.Fragment>
        <Grid className='base-outer-grid '>
          <GridInner style={{ padding: "1.2em" }}>
            {teams.map((team) => (
              <GridCell
                phone='4'
                tablet='2'
                desktop='3'
                style={{ textAlign: "center" }}
              >
                <h5>
                  <a href={team.link}>{team.name}</a>
                </h5>
              </GridCell>
            ))}
          </GridInner>
        </Grid>
      </React.Fragment>
    )
  }
}

export default FridayEventTeams