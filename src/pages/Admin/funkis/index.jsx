import React, {useEffect, useState} from 'react';

import { GridCell, Grid } from '@rmwc/grid';
import { 
  DataTable,
  DataTableBody,
  DataTableContent,
  DataTableHead,
  DataTableRow,
  DataTableHeadCell,
  DataTableCell,
 } from '@rmwc/data-table';
import {
  List, 
  ListItem,
  ListItemGraphic,
} from '@rmwc/list'
import { Checkbox } from '@rmwc/checkbox'
import { Select } from '@rmwc/select';
import { Button } from '@rmwc/button';

import { FormattedMessage, injectIntl } from 'react-intl';

// TODO: Bryt ut till intl


const defaultFunkis = {
  name:'',
  liuid:'',
  email: '',
  funkisAlts: [],
  funkisDays: {},
  selectedFunkisAlt: '',
}

// TODO: Lägg till faktiskt data, kolla strukturen, namn
const testFunkisar = [
  {
    name:'Test Testsson',
    liuid:'teste123',
    email: 'test123@student.liu.se',
    funkisAlts: [
      'Natt',
      'Funis1',
      'Troll',
    ],
    funkisDays: {
      1: {
        selected: false,
        day: '4/5',
      },
      2: {
        selected: true,
        day: '5/5',
      },
      3: {
        selected: false,
        day: '6/5',
      },
    },
    selectedFunkisAlt: 'Natt',
  },
  {
    name:'Test Testsson2',
    liuid:'teste666',
    email: 'teste666@student.liu.se',
    funkisDays: {
      1: {
        selected: false,
        day: '4/5',
      },
      2: {
        selected: false,
        day: '5/5',
      },
      3: {
        selected: true,
        day: '6/5',
      },
    },
    funkisAlts: [
      'Natt',
      'Funis1',
      'Troll',
    ],
    selectedFunkisAlt: 'Funis1',
  }
]

const FunkisDayItem = ({
  date,
  onClick,
  checked,
  index,
}) => {
return (
  <ListItem onClick={onClick} id={`funkis-day-alt-${index}`}>
    <ListItemGraphic icon={<Checkbox checked={checked}/>}/>
    {date}
  </ListItem>
);
}

const FunkisAdminRow = ({
  funkis,
}) => {

  const [funkisData, setFunkisData] = useState(defaultFunkis)

  useEffect(() => {
    setFunkisData(funkis);
  }, [funkis])


  const onSave = () => {
    console.log(funkisData);
    return;
  }

  const onChange = (e) => { // TODO: It might be that we need to store this in Redux.
    const { target: { id, value } } = e;
    switch(id) { // Could change IDs and just have them map to statenames
      case 'funkisType':
        setFunkisData({
          ...funkisData,
          'selectedFunkisAlt': value,
        });
        break;
      case 'funkisDay':
        setFunkisData({
          ...funkisData,
          'selectedFunkisDays': value,
        });
        break;
    default:
        break;
    }
    console.log("testChange");
    return
  }
  
  const {
    name,
    liuid,
    email,
    funkisAlts,
    funkisDays,
    selectedFunkisAlt,
  } = funkisData;
  // TODO: Move select and list to separate modal instead. Accessed by clicking the item
  return(
    <DataTableRow>
      <DataTableCell>
        {name}
      </DataTableCell>
      <DataTableCell>
        {liuid}
      </DataTableCell>
      <DataTableCell>
        {email}
      </DataTableCell>
      <DataTableCell>
        <Select
          id='funkisType'
          options={funkisAlts}
          value={selectedFunkisAlt}
          placeholder='Funkistyp' 
          onChange={onChange}
        />
      </DataTableCell>
      <DataTableCell>
      <List>
        {
        Object.keys(funkisDays).map((key, index) => {
          const {selected, day} = funkisDays[key];
          return (
            <FunkisDayItem
              date={day}
              index={index}
              checked={selected} 
              onClick={() => { // Don't want to lose context of key
                setFunkisData({
                  ...funkisData,
                  funkisDays: {
                    ...funkisDays,
                    [key]: {
                      ...funkisDays[key],
                      selected: !funkisDays[key].selected
                    },
                  }
                })
              }
            }
            />
          );
        })
        }        
      </List>
      </DataTableCell>
      <DataTableCell>
        <Button onClick={onSave} raised>
          Spara 
        </Button>
      </DataTableCell>
    </DataTableRow>
  );
}

const FunkisAdminComponent = ({
  funkisar = testFunkisar
}) => {

  return ( // TODO: Fix in-line text
    <>
        <DataTable>
          <DataTableContent>
            <DataTableHead>
              <DataTableRow>
                <DataTableHeadCell>Namn</DataTableHeadCell>
                <DataTableHeadCell>LiU-ID</DataTableHeadCell>
                <DataTableHeadCell>E-mail</DataTableHeadCell>
                <DataTableHeadCell>Funkis-typ</DataTableHeadCell>
                <DataTableHeadCell>Funkis-dagar</DataTableHeadCell>
                <DataTableHeadCell>Spara</DataTableHeadCell>
              </DataTableRow>
            </DataTableHead>
            <DataTableBody>
              {funkisar.map((f) => {
                return (
                  <FunkisAdminRow funkis={f}/>
                );
              }
              )}
            </DataTableBody>
          </DataTableContent>  
        </DataTable>  
    </>
  );
}

export default injectIntl(FunkisAdminComponent)