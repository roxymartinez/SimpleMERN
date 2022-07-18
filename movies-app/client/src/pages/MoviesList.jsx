import React, { useEffect, useState } from 'react'
import { useTable, useSortBy, useFilters } from 'react-table'
import { useNavigate } from 'react-router-dom'
import api from '../api'

import styled from 'styled-components'

const Wrapper = styled.div`
    padding: 1rem;

    table {
        border-spacing: 0;
        border: 1px solid black;

        tr {
            :last-child {
            td {
                border-bottom: 0;
            }
            }
        }

        th,
        td {
            margin: 0;
            padding: 0.5rem;
            border-bottom: 1px solid black;
            border-right: 1px solid black;

            :last-child {
            border-right: 0;
            }
        },
        th.sort-asc::before {
            border-bottom: 5px solid #22543d;
        },
        th.sort-desc::before {
            border-top: 5px solid #22543d;
        }
    }
`

const Update = styled.div`
    color: #ef9b0f;
    cursor: pointer;
`

const Delete = styled.div`
    color: #ff0000;
    cursor: pointer;
`

function UpdateMovie(row) {
    const navigate = useNavigate()
    const toUpdateMovie = () => {
        navigate(`/movies/update/${row.row._id}`, {state: {row}})
    }

    const updateThisMovie = event => {
        event.preventDefault()
        if (
            window.confirm(
                `Do you want to update this movie? ${row.row.name}`
            )
        ) {

            //window.location.href = `/movies/update/${row.row._id}`
            toUpdateMovie()
        }
    }
    console.log('value', row)

    return (<Update onClick={updateThisMovie}>Update</Update>)
}

function DeleteMovie(row) {
    const deleteThisMovie = (event) => {
        event.preventDefault()

        if (
            window.confirm(
                `Do you want to delete this movie? ${row.row.name}`
            )
        ) {
            console.log('value', row)
        }
    }

    return (<Delete onClick={deleteThisMovie}>Delete</Delete>)
}

function DropDown() {
    const [value, setValue] = React.useState('fruit');

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    return (
        <div>
            <label>
                What do we eat?
                <select value={value} onChange={handleChange}>
                    <option value="fruit">Fruit</option>
                    <option value="vegetable">Vegetable</option>
                    <option value="meat">Meat</option>
                </select>
            </label>

            <p>We eat {value}!</p>
        </div>
    )
}

function Table({ columns, data }) {
    // Use the state and functions returned from useTable to build your UI
    const {
        getTableProps,
        getTableBodyProps,
        headerGroups,
        rows,
        prepareRow,
        setFilter
    } = useTable({
        columns,
        data,
    },
        useFilters,
        useSortBy
    )

    const [searchInput, setSearchInput] = useState("")

    const [filteredResults, setFilteredResults] = useState([])

    const handleSearchItems = searchValue => {

        setFilter("name", searchValue)
        setSearchInput(searchValue)

        if (searchInput !== '') {
            const filteredData = data.filter((item) => {
                return Object.values(item).join('').toLowerCase().includes(searchInput.toLowerCase())
            })

            setFilteredResults(filteredData)

        }
        else {
            setFilteredResults(data)
        }
    }

    // Render the UI for your table
    return (
        <Wrapper>
            <input
                value={searchInput}
                onChange={(e) => handleSearchItems(e.target.value)}
                placeholder={"Search name"}
            />
            <table {...getTableProps()}>
                <thead>
                    {headerGroups.map(headerGroup => (
                        <tr {...headerGroup.getHeaderGroupProps()}>
                            {headerGroup.headers.map(column => (
                                <th
                                    {...column.getHeaderProps(column.getSortByToggleProps())}
                                    className={
                                        column.isSorted
                                            ? column.isSortedDesc
                                                ? "sort-desc"
                                                : "sort-asc"
                                            : ""
                                    }
                                >
                                    {column.render('Header')}</th>
                            ))}
                        </tr>
                    ))}
                </thead>
                <tbody {...getTableBodyProps()}>
                    {rows.map((row, i) => {
                        prepareRow(row)
                        return (
                            <tr {...row.getRowProps()}>
                                {row.cells.map(cell => {
                                    return <td {...cell.getCellProps()}>{cell.render('Cell')}</td>
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </Wrapper>
    )
}

function MoviesList() {
    const [loadingData, setLoadingData] = useState(true);
    const columns = React.useMemo(
        () => [
            {
                Header: 'ID',
                accessor: '_id',
                filterable: true,
            },
            {
                Header: 'Name',
                accessor: 'name',
                filterable: true,
            },
            {
                Header: 'Rating',
                accessor: 'rating',
                filterable: true,
            },
            {
                Header: 'Time',
                accessor: 'time',
                Cell: props => <span>{props.value.join(' / ')}</span>,
            },
            {
                id: 'del-btn',
                Cell: (props) => {
                    return (
                        <span>
                            <DeleteMovie row={props.row.original} />
                        </span>
                    )
                },
            },
            {
                id: 'update-btn',
                Cell: (props) => {
                    return (
                        <span>
                            <UpdateMovie row={props.row.original} />
                        </span>
                    )
                },
            },
            {
                id: 'test-btn',
                Cell: ({
                    value: initialValue,
                    row: { index },
                    column: { id },
                    updateMyData,
                }) => {
                    const onItemClick = value => {
                        console.log("value", value)
                        updateMyData(index, id, value)
                    }
                    return (
                        <DropDown
                            options={[
                                { label: "Male", value: "male" },
                                { label: "Female", value: "female" },
                            ]}
                            title={"Select Gender"}
                            selectedValue={initialValue}
                            onItemClick={onItemClick}
                        />
                    )
                }
            }
        ],
        []
    )

    const [data, setData] = useState([]);

    useEffect(() => {
        async function getData() {
            await api.getAllMovies().then(movies => {
                setData(movies.data.data)
                setLoadingData(false)
            })
        }

        if (loadingData) {
            getData()
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    return (
        <Wrapper>
            <Table columns={columns} data={data} />
        </Wrapper>
    )
}

export default MoviesList