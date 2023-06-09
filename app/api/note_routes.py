from flask import Blueprint, jsonify, request
from flask_login import login_required, current_user
from app.models import db, Note, Notebook, Tag

note_routes = Blueprint('notes', __name__)


# CREATE A NEW note
@note_routes.post('')
@login_required
def post_new_note():
    """
    Input: API fetch, body has keys: notebook_id, title, content
    Output: Dictionary of newly created note
    Purpose: Add a note to the database
    """
    json_data = request.json
    note = Note(
        user_id= current_user.id, notebook_id= json_data.get('notebook_id'), title= '', content='', trash= False
        )
    db.session.add(note)
    db.session.commit()
    return note.to_dict()

# READ notes
    # READ ALL USER'S notes
@note_routes.get('')
@login_required
def get_all_notes():
    """
    Input: API fetch
    Output: normalized list of all the user's notes
    Purpose: have a list of all the user's notes
    """
    notes = Note.query.filter_by(user_id = current_user.id, trash=False).order_by(Note.updated_at, Note.title)
    return { note.id: note.to_dict() for note in notes }


    # READ USER'S FIVE RECENT notes
@note_routes.get('/recent')
@login_required
def get_recent_notes():
    """
    Input: API fetch
    Output: normalized list of five most recently updated notes
    Purpose: quickly access five most recent notes, need to use note state somehow
    """
    notes = Note.query.filter_by(user_id = current_user.id, trash = False).order_by(Note.updated_at, Note.title).limit(5)
    return [note.to_dict() for note in notes]


    # READ SINGLE note
@note_routes.get('/<int:id>')
@login_required
def get_note(id):
    """
    Input: id of note
    Output: Dictionary of note
    Purpose: Get details of note from database
    """
    note = Note.query.get(id)
    if not note:
        return jsonify({
            "message": "Note not found"
        }), 404
    if not note.user_id == current_user.id:
        return jsonify({
            "message": "Unauthorized"
        }), 401
    return note.to_dict()


    # READ USER'S TRASH notes
@note_routes.get('/trash')
@login_required
def get_trash_notes():
    """
    Input: API fetch
    Output: normalized list of notes moved to trash
    Purpose: get all the trash notes to display on page
    """
    notes = Note.query.filter_by(user_id = current_user.id, trash = True)
    return { note.id: note.to_dict() for note in notes }


# UPDATE note
    # UPDATE TITLE, CONTENT, OR NOTEBOOK
@note_routes.put('/<int:id>')
@login_required
def edit_note(id):
    """
    Input: id of noted to be edited, API fetch body has keys: title and/or content
    Output: Edited dictionary of database entry
    Purpose: Edit a note in the database
    """
    json_data = request.json
    note = Note.query.get(id)
    if not note:
        return jsonify({
            "message": "Note not found"
        }), 404
    if not note.user_id == current_user.id:
        return jsonify({
            "message": "Unauthorized"
        }), 401
    if json_data.get('tags'):
        note.tags = list(Tag.query.filter(Tag.id.in_(json_data.get('tags'))).all())
    if json_data.get('notebook_id'):
        notebook = Notebook.query.get(json_data.get('notebook_id'))
        if not notebook:
            return jsonify({
            "message": "Notebook not found"
        }), 404
        if not notebook.user_id == current_user.id:
            return jsonify({
            "message": "Unauthorized"
        }), 401
        note.notebook_id = json_data.get('notebook_id')
    if json_data.get('title'):
        note.title = json_data.get('title')
    if json_data.get('content'):
        note.content = json_data.get('content')
    db.session.commit()
    return note.to_dict()


    # MOVE IN OR OUT OF TRASH
@note_routes.put('/<int:id>/delete')
@login_required
def trash_note(id):
    """
    Input: id of note being moved in or out of trash
    Output: edited dictionary of database entry
    Purpose: moves the note to trash without deleting in case it is still needed
    """
    note = Note.query.get(id)
    if not note:
        return jsonify({
            "message": "Note not found"
        }), 404
    if not note.user_id == current_user.id:
        return jsonify({
            "message": "Unauthorized"
        }), 401
    note.trash = not note.trash
    db.session.commit()
    return note.to_dict()


# DELETE note
@note_routes.delete('/<int:id>')
@login_required
def delete_note(id):
    """
    Input: id of note to be deleted
    Output: success or failure message
    Purpose: remove an entry from the database
    """
    note = Note.query.get(id)
    if not note:
        return jsonify({
            "message": "Note not found"
        }), 404
    if not note.user_id == current_user.id:
        return jsonify({
            "message": "Unauthorized"
        }), 401
    db.session.delete(note)
    db.session.commit()
    return jsonify({
        "message": "Successfully deleted"
    }), 200
