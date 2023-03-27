import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { NavLink, useHistory } from "react-router-dom";
import { readAllNotes } from "../../store/note";


function ViewAllNotes() {

    const dispatch = useDispatch();
    const history = useHistory();
    const notes = useSelector(state => Object.values(state.notes.notes));

    useEffect(() => {
        dispatch(readAllNotes());
    }, [dispatch]);

    if (!notes) return null;

    return (
        <div className="notes-view-all">
            <h1>hello from view all notes</h1>
            <div className="notes-view-all-header">
                <h1>Notes</h1>
            </div>
            <div className="notes-view-all-action">
                {notes.length === 1 ? (
                    <p>1 note</p>
                ) : (
                    <p>{notes.length} notes</p>
                )}
            </div>
            {notes?.map(note => (
                <div style={{border: "1px solid purple"}}>
                    <NavLink to={`/notes/${note.id}`}>{note.title ? note.title : "Untitled"}</NavLink>
                    <p>{note.updatedAt}</p>
                </div>
            ))}
        </div>
    )

}

export default ViewAllNotes;