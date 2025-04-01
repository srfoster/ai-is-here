import React, { useState, useRef } from "react";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Card,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import authorsData from "../data/authors"; 

export default ({ resources, onFilter }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTags, setSelectedTags] = useState([]);
  const [selectedAuthor, setSelectedAuthor] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");

  // Cache the initial resources list
  const allResources = useRef(resources);
  if(allResources.current.length === 0) {
    allResources.current = resources;
  }

  // Safely construct allTags
  const allTags = [
    ...new Set(
      allResources.current.flatMap((resource) => resource.tags || [])
    ),
  ];

  console.log("allTags", allTags);
  
  // Safely construct allAuthors
  const allAuthors = [
    ...new Set(
      allResources.current.flatMap((resource) => resource.author || [])
    ),
  ]
    .map((author) => authorsData.find((a) => a.slug === author))
    .filter((author) => author); // Remove undefined authors

  const handleSearch = (e) => {
    setSearchTerm(e.target.value.toLowerCase());
    applyFilters(e.target.value.toLowerCase(), selectedTags, selectedAuthor, sortOrder);
  };

  const handleTagChange = (tag) => {
    const updatedTags = selectedTags.includes(tag)
      ? selectedTags.filter((t) => t !== tag)
      : [...selectedTags, tag];
    setSelectedTags(updatedTags);
    applyFilters(searchTerm, updatedTags, selectedAuthor, sortOrder);
  };

  const handleAuthorChange = (e) => {
    setSelectedAuthor(e.target.value);
    applyFilters(searchTerm, selectedTags, e.target.value, sortOrder);
  };

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
    applyFilters(searchTerm, selectedTags, selectedAuthor, e.target.value);
  };

  const applyFilters = (search, tags, author, sort) => {
    const filteredResources = allResources.current
      .filter((resource) => {
        if(typeof resource.content === "string")
          return (resource.content.toLowerCase().includes(search) ||
            resource.title.toLowerCase().includes(search))
        
        return (
          resource.content.some((c) => typeof(c) == "string" && c.toLowerCase().includes(search)) ||
          resource.title.toLowerCase().includes(search)
        );
      }
      )
      .filter(
        (resource) =>
          tags.length === 0 || tags.every((tag) => resource.tags?.includes(tag)) // Default to all resources if no tags are selected
      )
      .filter((resource) => !author || resource.author?.includes(author))
      .sort((a, b) => {
        if (sort === "newest") {
          return new Date(b.dateCreated) - new Date(a.dateCreated);
        } else {
          return new Date(a.dateCreated) - new Date(b.dateCreated);
        }
      });

    onFilter(filteredResources);
  };

  return (
    <Accordion defaultExpanded={false}>
      <AccordionSummary expandIcon={<ExpandMoreIcon />}>
        <Typography variant="h8">Search and Filter</Typography>
      </AccordionSummary>
      <AccordionDetails>
        <Card style={{ padding: "1em", width: "100%" }}>
          <Stack spacing={2}>
            {/* Search Field */}
            <TextField
              label="Search by content or title"
              variant="outlined"
              fullWidth
              value={searchTerm}
              onChange={handleSearch}
            />

            {/* Filter by Tags */}
            <FormGroup>
              <Typography variant="subtitle1">Filter by Tags</Typography>
              <Stack direction="row" spacing={1} flexWrap="wrap">
                {allTags.map((tag) => (
                  <FormControlLabel
                    key={tag}
                    control={
                      <Checkbox
                        checked={selectedTags.includes(tag)}
                        onChange={() => handleTagChange(tag)}
                      />
                    }
                    label={tag}
                  />
                ))}
              </Stack>
            </FormGroup>

            <FormControl fullWidth>
              <InputLabel>Filter by Author</InputLabel>
              <Select value={selectedAuthor} onChange={handleAuthorChange}>
                <MenuItem value="">All Authors</MenuItem>
                {allAuthors.map((author) => (
                  <MenuItem key={author.slug} value={author.slug}>
                    {author.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl fullWidth>
              <InputLabel>Sort by Date</InputLabel>
              <Select value={sortOrder} onChange={handleSortChange}>
                <MenuItem value="newest">Newest First</MenuItem>
                <MenuItem value="oldest">Oldest First</MenuItem>
              </Select>
            </FormControl>
          </Stack>
        </Card>
      </AccordionDetails>
    </Accordion>
  );
};