const {Schema, model} = require('mongoose');

const ToDoSchema = new Schema(
    {

        user:{
            type:Schema.Types.ObjectId,
            ref: "User"
        },
        content: {
            type: String,
            required: true,

        },
        complete: {
            type: Boolean,
            default: false,
        },
        completeAt: {
            type: Date,
        }
        
},
{
    timestamps: true
}
);


// export

const ToDo = model("ToDo", ToDoSchema);

module.exports= ToDo;