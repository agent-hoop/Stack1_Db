import express from 'express';
import NoteModel from '../models/NoteModel.js';
const router = express.Router()

router.get('/', async (req,res)=>{
    try{
        const getAll = await NoteModel.find();
        res.status(200).json(getAll)
    }
    catch(err){
        console.log('Fail to get error',err)
    }
})

// Add notes
router.post('/add', async (req,res)=>{
    const {title,content,noteType} = req.body;
    try{
        const add = await NoteModel.create({content,title,noteType});
        res.status(201).json(add)
    }
    catch(err){
        console.log('Error creating ',err);
    }
})

router.get('/:id', async (req,res)=>{
    const {id} = req.params;
    try{
        const getNoteById = await NoteModel.findById(id)
        res.status(200).json(getNoteById)

    }
    catch(err)
    {
        res.status(400).json({message:'Error getting the note ',err})
    }
})

// To del the notes
router.delete('/:id',async(req,res)=>{
    const {id} = req.params;
    try{
        const delNotes = await NoteModel.findByIdAndDelete(id)
        res.status(200).json({message:"Success Deleting",delNotes})
    }
    catch(err){
        res.status(300).json({message:"Del success"})
    }
})

// To edit the existing note 
router.patch('/:id', async (req, res) => {
  const { id } = req.params;
  const { title, content, noteType } = req.body;

  if (!title && !content && !noteType) {
    return res.status(400).json({ message: 'Nothing to update' });
  }

  const updateData = {};
  if (title) updateData.title = title;
  if (content) updateData.content = content;
  if (noteType) updateData.noteType = noteType;

  try {
    const updatedNote = await NoteModel.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    if (!updatedNote) {
      return res.status(404).json({ message: 'Note not found' });
    }

    res.status(200).json(updatedNote);
  } catch (err) {
    res.status(500).json({ message: 'Error updating note' });
  }
});


export default router;