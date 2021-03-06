const express = require('express');
const { create, getMyblog, getAll, getById, editById, deleteById, getByTitle, getByTag} = require('../controllers/blog');
const router = express.Router();
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({
    destination: function(req, file, cb){
        cb(null, 'uploads/');
    },
    filename:function(req, file, cb){
        cb(null, file.originalname + '-' + Date.now() + path.extname(file.originalname));
    }
});
const upload= multer ({ storage: storage });

//create new blog
router.post('/',upload.single('photo') ,async (req, res, next)=>{
    const { body, user: { id } } = req;
    const _file = req.file.filename;
    try{
        const blog = await create({ ...body, photo:_file ,author: id });
        res.json(blog);
    } catch(e){
        next (e); //sending error handler
    } 
});



//get user blog only
router.get('/getblog', async (req, res, next)=>{
    const { user: { id } } = req;
    try{
        const blogs = await getMyblog({ author: id }); 
        res.json(blogs)
    } catch(e){
        next (e); //sending error handler
    }
});

//get all blogs for home page
router.get('/', async (req, res, next) => {
    try {
      const blogs = await getAll(); 
      res.json(blogs);
    } catch (e) {
      next(e);
    }
  });

//get blog by id
router.get('/:id', async (req, res, next)=>{

    const { params: { id } } = req;
    try{
        const blogs = await getById(id);
        res.json(blogs)
    } catch(e){
        next (e); //sending error handler
    }
});

//edit blog by id
router.patch('/:editid',async(req, res, next)=>{
    const {user:{id}, params: { editid }, body } = req;
    const updatedAt=Date.now();
    try{
        const blogs = await editById(id,editid,{...body, updatedAt:updatedAt});
        res.json(blogs)
    } catch(e){
        next (e); //sending error handler
    }
});

//delete blog by id
router.delete('/:deleteid', async (req, res, next)=>{
    const {user: {id}, params: { deleteid } } = req;
    try{
        const blog = await deleteById(id, deleteid);
        res.json(blog)
    } catch(e){
        next (e); //sending error handler
    }
});
//get(search) blog by title
router.get('/title/:title',async (req, res, next)=>{
    Title=req.params.title;  
    try{
        const blog = await  getByTitle(Title);
        res.json(blog);
    } catch (e) {
        next(e);
    }
});

//get(search) blog by tag
router.get('/tags/:tags',async (req, res, next)=>{
    //const { user: { id }, params: { tags } } = req;
    tags=req.params.tags;
    try{
        const blog = await getByTag(tags);
        res.json(blog);
    } catch (e) {
        next(e);
    }
});

module.exports = router;