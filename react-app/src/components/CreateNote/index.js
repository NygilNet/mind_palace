import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { readSingleNote } from "../../store/note";
import { updateNote } from "../../store/note";
import Navigation from "../Navigation";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function CreateNote({ sessionUser }) {

    const dispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams();

    useEffect(() => {
        dispatch(readSingleNote(id));
        setTitle(note.title);
        setContent(note.content);
    }, [dispatch, id])

    const note = useSelector(state => state.notes.note);

    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [saving, setSaving] = useState(false);


    const handleChange = async (e) => {
        setSaving(true);
        const newNote = {
            title,
            content
        };
        const update = await dispatch(updateNote(id, newNote));
        if (update) setSaving(false);
    }

    if (!note) return null;

    return(
        <div className="display-page">
            <Navigation />
            <div className="edit-note-container">
                <form>
                    <input
                    type="text"
                    value={title}
                    onChange={e => {
                        setTitle(e.target.value)
                        handleChange(e)
                    }}
                    maxLength="255"
                    placeholder="Title"
                    />
                    <ReactQuill
                    className="edit-note-editor"
                    theme="snow"
                    value={content}
                    onChange={e => {
                        setContent(e)
                        handleChange(e)
                    }}
                    placeholder="Start writing..."
                    />
                </form>
                {saving ? (<p>Saving...</p>) : (<p>All changes saved</p>)}
            </div>
        </div>
    )

}

export default CreateNote;
