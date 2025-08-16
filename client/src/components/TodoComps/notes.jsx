import React, { useState, useContext } from 'react'
import ThemeContext from '../../themeContext';
import getEnvironment from '../../../getEnvironment';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { X, FileText, Plus, Edit3 } from "lucide-react";
import { format } from "date-fns";

function Notes({ openNotesDialog, setOpenNotesDialog, item, users }) {

    // Notes functionality
    const { theme, user } = useContext(ThemeContext);
    const apiURL = getEnvironment();
    const [notes, setNotes] = useState(item.notes);
    const [selectedTodoForNotes, setSelectedTodoForNotes] = useState(item);
    const [newNoteContent, setNewNoteContent] = useState("");
    const [editingNoteIndex, setEditingNoteIndex] = useState(-1);

    const resetNotesForm = () => {
        setNewNoteContent("");
        setEditingNoteIndex(-1);
    }

    const addNote = async () => {
        if (!newNoteContent.trim() || !selectedTodoForNotes) return;

        try {
            const newNote = {
                content: newNoteContent.trim(),
                lastUpdatedBy: user._id,
                lastUpdatedAt: new Date()
            };

            const temp_notes = [...item.notes, newNote];
            console.log(selectedTodoForNotes)

            // API call for adding note - you'll need to create this endpoint
            const response = await fetch(`${apiURL}/api/v1/subTodos/setNotes`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    _id: selectedTodoForNotes._id,
                    notes: temp_notes
                })
            });

            if (response.ok) {
                item.notes = temp_notes;
                setNotes(item.notes)
            } else {
                throw new Error("Error occurred while adding note");
            }

            resetNotesForm();
        } catch (error) {
            console.log(error);
        }
    };

    const editNote = async (noteIndex) => {
        if (!newNoteContent.trim() || !selectedTodoForNotes) return;

        try {
            const updatedNote = {
                content: newNoteContent.trim(),
                lastUpdatedBy: user._id,
                lastUpdatedAt: new Date()
            };

            item.notes[noteIndex] = updatedNote;
            // API call for editing note - you'll need to create this endpoint
            const response = await fetch(`${apiURL}/api/v1/subTodos/setNotes`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    _id: selectedTodoForNotes._id,
                    notes: item.notes
                })
            });

            if (response.ok) {
                setNotes(item.notes)
            } else {
                throw new Error("Error occurred while editing note");
            }

            resetNotesForm();
        } catch (error) {
            console.log(error);
        }
    };

    const deleteNote = async (noteIndex) => {
        if (!selectedTodoForNotes) return;

        try {

            item.notes = item.notes.filter((_, i) => i != noteIndex)

            // API call for deleting note - you'll need to create this endpoint
            const response = await fetch(`${apiURL}/api/v1/subTodos/setNotes`, {
                method: "POST",
                credentials: "include",
                headers: { "Content-type": "application/json" },
                body: JSON.stringify({
                    _id: selectedTodoForNotes._id,
                    notes: item.notes
                })
            });

            if (response.ok) {
                setNotes(item.notes)
            } else {
                throw new Error("Error occurred while deleting note");
            }
        } catch (error) {
            console.log(error);
        }
    };

    const formatNoteTimestamp = (timestamp) => {
        if (!timestamp) return;
        const date = new Date(timestamp);
        return format(date, 'MMM dd, yyyy HH:mm');
    };

    const getUserName = (id) => {
        for (let i in users) {
            if (users[i]._id == id) return users[i].firstname;
        }
    }

    return (
        <Dialog open={openNotesDialog} onOpenChange={() => { setOpenNotesDialog(false) }}>
            <DialogContent className={`max-w-2xl max-h-[80vh] overflow-y-auto ${theme === 'light' ? 'bg-white' : 'bg-neutral-900'}`}>
                <DialogHeader>
                    <DialogTitle className={`text-xl font-bold ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
                        Notes for: {selectedTodoForNotes?.content}
                    </DialogTitle>
                </DialogHeader>
                <DialogDescription className="text-sm text-gray-500">
                    Notes
                </DialogDescription>

                <div className="space-y-4">
                    {/* Add/Edit Note Form */}
                    <div className={`p-4 rounded-lg border ${theme === 'light' ? 'bg-gray-50 border-gray-200' : 'bg-neutral-800 border-neutral-700'}`}>
                        <div className="space-y-3">
                            <div className="flex items-center justify-between">
                                <label className={`text-sm font-medium ${theme === 'light' ? 'text-gray-700' : 'text-gray-300'}`}>
                                    {editingNoteIndex >= 0 ? 'Edit Note' : 'Add New Note'}
                                </label>
                                {editingNoteIndex >= 0 && (
                                    <Button
                                        variant="outline"
                                        size="sm"
                                        onClick={resetNotesForm}
                                    >
                                        Cancel Edit
                                    </Button>
                                )}
                            </div>
                            <Textarea
                                placeholder="Enter your note here..."
                                value={newNoteContent || ""}
                                onChange={(e) => setNewNoteContent(e.target.value)}
                                className={`min-h-[100px] ${theme === 'light' ? 'bg-white' : 'bg-neutral-700'}`}
                            />
                            <div className="flex gap-2">
                                <Button
                                    onClick={editingNoteIndex >= 0 ? () => editNote(editingNoteIndex) : addNote}
                                    disabled={!newNoteContent.trim()}
                                    className={`${theme === 'light' ? 'bg-blue-500 hover:bg-blue-600' : 'bg-blue-600 hover:bg-blue-500'} text-white`}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    {editingNoteIndex >= 0 ? 'Update Note' : 'Add Note'}
                                </Button>
                            </div>
                        </div>
                    </div>

                    {/* Notes List */}
                    <div className="space-y-3">
                        <h3 className={`text-lg font-semibold ${theme === 'light' ? 'text-gray-900' : 'text-gray-100'}`}>
                            Notes ({selectedTodoForNotes?.notes?.length || 0})
                        </h3>

                        {notes?.length === 0 ? (
                            <div className={`text-center py-8 ${theme === 'light' ? 'text-gray-500' : 'text-gray-400'}`}>
                                <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
                                <p>No notes yet. Add your first note above.</p>
                            </div>
                        ) : (
                            <div className="space-y-3">
                                {notes?.map((note, index) => (
                                    <Card key={index} className={`${theme === 'light' ? 'bg-white border-gray-200' : 'bg-neutral-800 border-neutral-700'}`}>
                                        <CardContent className="p-4">
                                            <div className="flex justify-between items-start mb-3">
                                                <div>
                                                    <p className={`text-sm ${theme === 'light' ? 'text-gray-600' : 'text-gray-400'}`}>
                                                        By {getUserName(note.lastUpdatedBy)}
                                                    </p>
                                                    <p className={`text-xs ${theme === 'light' ? 'text-gray-500' : 'text-gray-500'}`}>
                                                        {formatNoteTimestamp(note.timestamp)}
                                                    </p>
                                                </div>
                                                <div className="flex gap-1">
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0"
                                                        onClick={() => {
                                                            setNewNoteContent(note.content);
                                                            setEditingNoteIndex(index);
                                                        }}
                                                    >
                                                        <Edit3 className="h-3 w-3" />
                                                    </Button>
                                                    <Button
                                                        variant="ghost"
                                                        size="sm"
                                                        className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                                                        onClick={() => deleteNote(index)}
                                                    >
                                                        <X className="h-3 w-3" />
                                                    </Button>
                                                </div>
                                            </div>
                                            <p className={`${theme === 'light' ? 'text-gray-900' : 'text-gray-100'} whitespace-pre-wrap`}>
                                                {note.content}
                                            </p>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default Notes
