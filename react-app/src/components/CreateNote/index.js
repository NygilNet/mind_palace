import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useHistory, useParams } from "react-router-dom";
import { readSingleNote } from "../../store/note";
import { updateNote } from "../../store/note";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function CreateNote() {

    const dispatch = useDispatch();
    const history = useHistory();
    const { id } = useParams();
    const note = useSelector(state => state.notes.note);
    const user = useSelector(state => state.session.user);


    useEffect(() => {
        dispatch(readSingleNote(id));
        // setTitle(note.title);
        // setContent(note.content);
    }, [dispatch, id])


    const [title, setTitle] = useState(note.title);
    const [content, setContent] = useState(note.content);
    const [saving, setSaving] = useState(false);


    // const handleTitleChange = async (e) => {
    //     setSaving(true);
    //     setTitle(e.target.value);
    //     const newNote = { title };
    //     const update = await dispatch(updateNote(id, newNote));
    //     if (update) setSaving(false);
    // }

    // useEffect(() => {
    //     setSaving(true);
    //     const newNote = {
    //         title,
    //         content
    //     }
    //     dispatch(updateNote(id, newNote))
    //     setSaving(false);
    // }, [title, content])

    const handleChange = async (e) => {
        setSaving(true);
        const newNote = {
            title,
            content
        };
        const update = await dispatch(updateNote(id, newNote));
        if (update) setSaving(false);
    }

    // if (note.userId !== user.id) return history.push('/');

    if (!note) return null;
    return(
        <>
            <h1>hello from create a note</h1>
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
        </>
    )

}

export default CreateNote;
