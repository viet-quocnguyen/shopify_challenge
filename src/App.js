import React, { useState, useEffect } from "react";
import { searchMovies } from "./api";

import {
	Container,
	Grid,
	FormControl,
	TextField,
	List,
	ListItem,
	ListItemText,
	ListItemSecondaryAction,
	Button,
	InputAdornment,
	IconButton,
	Typography,
} from "@material-ui/core";
import Alert from "@material-ui/lab/Alert";
import SearchIcon from "@material-ui/icons/Search";
import "./App.css";

function App() {
	const [prevSearch, setPrevSearch] = useState("");
	const [movieName, setMovieName] = useState("");
	const [searchResults, setSearchResults] = useState([]);
	const [nominations, setNominations] = useState([]);

	useEffect(() => {
		// get nominations from localStorage if it exists
		const nominationsFromLocalStorage = JSON.parse(
			localStorage.getItem("nominations")
		);

		if (Array.isArray(nominationsFromLocalStorage)) {
			setNominations(nominationsFromLocalStorage);
		}

		console.log("App starts successfully");
	}, []);

	// Send request to OMDb API to look for movies with current search value
	const handleSubmit = (e) => {
		if (e) {
			e.preventDefault();
		}

		searchMovies(movieName)
			.then((response) => {
				console.log(response);
				const data = response.data.Search;

				if (data) {
					setSearchResults(data);
				}

				setPrevSearch(movieName); // update the search results
				setMovieName(""); // clear the search text field
			})
			.catch((error) => console.log(error.message));
	};

	// handle user input when typing in the text field
	const handleInput = (e) => {
		setMovieName(e.target.value);
	};

	// add selected movie to nominations list
	const handleAddNomination = (movie) => {
		if (nominations.length < 5) {
			let nominationsClone = [...nominations];
			nominationsClone.push(movie);

			setNominations(nominationsClone); // update nominations in the state

			// update nominations in the localstorage
			localStorage.setItem(
				"nominations",
				JSON.stringify(nominationsClone)
			);
		}
	};

	// remove selected movie from nominations list
	const handleRemoveNomination = (selectedMovie) => {
		let newNominations = nominations.filter(
			(movie) => movie.imdbID !== selectedMovie.imdbID
		);

		setNominations(newNominations); // update nominations in the state

		// update nominations in the localstorage
		localStorage.setItem("nominations", JSON.stringify(newNominations));
	};

	const isExistInNominations = (searchMovie) => {
		return (
			nominations.filter((movie) => movie.imdbID === searchMovie.imdbID)
				.length > 0
		);
	};

	return (
		<Container>
			<Grid container spacing={3}>
				{/* Title of the app */}
				<Grid item xs={12}>
					<h1>The Shoppies by Viet Nguyen</h1>
				</Grid>

				{/* Input component */}
				<Grid className="input-wrapper" item xs={12}>
					<form
						className="input-form"
						noValidate
						autoComplete="off"
						onSubmit={handleSubmit}
					>
						<TextField
							value={movieName}
							className="input-textfield"
							onChange={handleInput}
							id="filled-basic"
							label="Enter movie name"
							variant="outlined"
							InputProps={{
								startAdornment: (
									<IconButton
										onClick={() => handleSubmit()}
										color="primary"
										component="span"
									>
										<SearchIcon />
									</IconButton>
								),
							}}
						/>
					</form>
				</Grid>

				{/* Banner component, only shows when nominations reach 5 elements */}
				<Grid item xs={12}>
					{nominations.length === 5 ? (
						<Alert severity="warning">
							You could only add up to 5 movies to nominations
						</Alert>
					) : null}
				</Grid>

				{/* Search results with nominate option */}
				<Grid className="search-result-wrapper" item md={6} xs={12}>
					<div className="search-result">
						<h3>Results for "{prevSearch}"</h3>
						<List>
							{searchResults.map((movie, index) => (
								<ListItem key={index} className="card-item">
									<ListItemText
										className="card-text"
										primary={
											<Typography>
												{movie.Title}
											</Typography>
										}
										secondary={
											<Typography>
												({movie.Year})
											</Typography>
										}
									/>

									<Button
										variant="contained"
										size="small"
										color="primary"
										disabled={isExistInNominations(movie)}
										onClick={() =>
											handleAddNomination(movie)
										}
									>
										Nominate
									</Button>
								</ListItem>
							))}
						</List>
					</div>
				</Grid>

				{/* Nominations list with remove option for each item */}
				<Grid className="nominations-wrapper" item md={6} xs={12}>
					<div className="nominations">
						<h3>Nominations</h3>
						<List>
							{nominations.map((movie, index) => (
								<ListItem key={index} className="card-item">
									<ListItemText
										className="card-text"
										primary={
											<Typography>
												{movie.Title}
											</Typography>
										}
										secondary={
											<Typography>
												({movie.Year})
											</Typography>
										}
									/>

									<Button
										variant="contained"
										size="small"
										color="secondary"
										onClick={() =>
											handleRemoveNomination(movie)
										}
									>
										Remove
									</Button>
								</ListItem>
							))}
						</List>
					</div>
				</Grid>
			</Grid>
		</Container>
	);
}

export default App;
