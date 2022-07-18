import React, { useState, useEffect } from 'react'
import api from '../api'
import { useParams, useLocation, useNavigate } from 'react-router-dom'

import styled from 'styled-components'

const Title = styled.h1.attrs({
    className: 'h1',
})``

const Wrapper = styled.div.attrs({
    className: 'form-group',
})`
    margin: 0 30px;
`

const Label = styled.label`
    margin: 5px;
`

const InputText = styled.input.attrs({
    className: 'form-control',
})`
    margin: 5px;
`

const Button = styled.button.attrs({
    className: `btn btn-primary`,
})`
    margin: 15px 15px 15px 5px;
`

const CancelButton = styled.a.attrs({
    className: `btn btn-danger`,
})`
    margin: 15px 15px 15px 5px;
`

function DoUpdate(state) {

    const navigate = useNavigate()
    const toMoviesList = () => {
        navigate('/movies/list')
    }

    let data = state.movieData

    let payload = { id: data.id, name: data.name, rating: data.rating, time: data.time }

    console.log('DoUpdate: state', state)
    console.log('DoUpdate: payload', payload)
    console.log('DoUpdate: data', data)

    const handleUpdateMovie = async event => {
        event.preventDefault()

        await api.updateMovieById(data.id, payload).then(res => {
            window.alert(`Movie updated successfully`)

            toMoviesList()
        })
    }

    return (
        <Button onClick={(event) => { handleUpdateMovie(event) }}>Update Movie</Button>
    )
}

function MoviesUpdate() {
    const params = useParams()
    const location = useLocation()

    console.log("MoviesUpdate: params", params)
    console.log("MoviesUpdate: location", location)

    let movie = location.state.row.row

    const [name, setName] = useState(movie.name)

    const [rating, setRating] = useState(movie.rating)

    const [time, setTimes] = useState(movie.time)

    const [loadingData, setLoadingData] = useState(true);

    const handleChangeInputName = event => {
        if (!loadingData) {
            const newName = event.target.value
            console.log('new name: ', newName)
            setName(newName)
        }
        console.log('handleChangeInputName')
    }

    const handleChangeInputRating = event => {
        if (!loadingData) {
            const newRating = event.target.validity.valid
                ? event.target.value
                : this.state.rating

            setRating(newRating)
        }
        console.log('handleChangeInputRating')
    }

    const handleChangeInputTime = event => {
        if (!loadingData) {
            const newTime = event.target.value
            setTimes(newTime.split('/'))
        }
        console.log('handleChangeInputTime')
    }

    const [data, setData] = useState({
        id: params.id,
        name: name,
        rating: rating,
        time: time,
    });


    const getNewData = () => {
        let newData = {
            id: params.id,
            name: name,
            rating: rating,
            time: time,
        }
        return newData
    }


    useEffect(() => {
        async function getData() {
            await api.getMovieById(data.id).then(movie => {
                setData({
                    name: movie.data.data.name,
                    rating: movie.data.data.rating,
                    time: movie.data.data.time.join('/'),
                })
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
            <Title>Create Movie</Title>

            <Label>Name: </Label>
            <InputText
                type="text"
                value={name}
                onChange={(event) => { handleChangeInputName(event) }}
            />

            <Label>Rating: </Label>
            <InputText
                type="number"
                step="0.1"
                lang="en-US"
                min="0"
                max="10"
                pattern="[0-9]+([,\.][0-9]+)?"
                value={rating}
                onChange={(event) => { handleChangeInputRating(event) }}
            />

            <Label>Time: </Label>
            <InputText
                type="text"
                value={time}
                onChange={(event) => { handleChangeInputTime(event) }}
            />

            <DoUpdate id={params.id} movieData={getNewData()}></DoUpdate>
            <CancelButton href={'/movies/list'}>Cancel</CancelButton>
        </Wrapper>
    )
}


export default MoviesUpdate