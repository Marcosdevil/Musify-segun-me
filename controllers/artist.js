'use strict'

var path = require('path');
var fs = require('fs');
var mongoosePaginate = require('mongoose-pagination');
var Artist = require('../models/artist');
var Album = require('../models/album');
var Song = require('../models/song');


function getArtist(req, res){
    var artistId = req.params.id;

    Artist.findById(artistId, (err, artist) =>{
        if(err){
            res.status(500).send({message: 'Error en la petición.'});
        }else{
            if(!artist){
                res.status(404).send({message: 'El artista no existe.'});
            }else{
                res.status(200).send({artist});
            }
        }
    });
}


function saveArtist(req, res){
    var artist = new Artist();

    var params = req.body;
    artist.name = params.name;
    artist.description = params.description;
    artist.image = 'null';

    artist.save((err, artistStored) =>{
        if(err){
            res.status(500).send({message: 'Error al guardar el artista.'});
        }else{
            if(!artistStored){
                res.status(404).send({message: 'El artista no ha sido guardado.'});
            }else{
                res.status(200).send({artist: artistStored});
            }
        }
    });
}

function getArtists(req, res){
    if(req.params.page){
        var page = req.params.page;    
    }else{
        var page = 1;
    }
    
    var itemsPerPage = 3;

    Artist.find().sort('name').paginate(page, itemsPerPage, function(err, artists, total){
        if(err){
            res.status(500).send({message: 'Error al guardar el artista.'});
        }else{
            if(!artists){
                res.status(500).send({message: 'Error al guardar el artista.'});
            }else{
                return res.status(200).send({
                    total_items: total,
                    artists: artists
                });
            }
        }
    });
}

function updateArtist(req, res){
    var artistId = req.params.id;
    var update = req.body;

    Artist.findByIdAndUpdate(artistId, update, (err, artistUpdated) =>{
        if(err){
            res.status(500).send({message: 'Error al guardar el artista.'});
        }else{
            if(!artistUpdated){
                res.status(404).send({message: 'El artista no ha sido actualizado.'});
            }else{
                res.status(200).send({artist: artistUpdated});
            }
        }
    });
}

// En el método de borrar a un artista tengo que tener en cuenta que cuando lo haga además tengo que borrar todos sus albumes con todas sus canciones.
function deleteArtist(req, res){
    var artistId = req.params.id;

    Artist.findByIdAndRemove(artistId, (err, artistRemoved) => {
        if(err){
            res.status(500).send({message: 'Error al eliminar el artista.'});
        }else{
            if(!artistRemoved){
                res.status(404).send({message: 'El artista no ha sido eliminado.'});
            }else{
                Album.find({artist: artistRemoved_id}).remove((err, albumRemoved) =>{
                    if(err){
                        res.status(500).send({message: 'Error al eliminar el albúm.'});
                    }else{
                        if(!albumRemoved){
                            res.status(404).send({message: 'El albúm no ha sido eliminado.'});
                        }else{
                            Song.find({album: albumRemoved_id}).remove((err, songRemoved) =>{
                                if(err){
                                    res.status(500).send({message: 'Error al eliminar la canción.'});
                                }else{
                                    if(!songRemoved){
                                        res.status(404).send({message: 'La canción no se ha eliminado.'});
                                    }else{
                                        res.status(200).send({artist: artistRemoved});
                                    }
                                }
                            });
                        }
                    }
                });
            }
        }
    });
}

module.exports = {
    getArtist,
    saveArtist,
    getArtists,
    updateArtist,
    deleteArtist
};