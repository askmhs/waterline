var Waterline = require('../../../lib/waterline'),
    assert = require('assert');

describe('Model', function() {
  describe('association', function() {
    describe('getter', function() {

      /////////////////////////////////////////////////////
      // TEST SETUP
      ////////////////////////////////////////////////////

      var collection;

      before(function(done) {
        var waterline = new Waterline();

        var User = Waterline.Collection.extend({
          adapter: 'foo',
          tableName: 'person',
          attributes: {
            preferences: {
              collection: 'preference'
            }
          }
        });

        var Preference = Waterline.Collection.extend({
          adapter: 'foo',
          tableName: 'preference',
          attributes: {
            user: {
              model: 'person'
            }
          }
        });

        waterline.loadCollection(User);
        waterline.loadCollection(Preference);

        var _values = [
          { preference: [{ foo: 'bar' }, { foo: 'foobar' }] },
          { preference: [{ foo: 'a' }, { foo: 'b' }] },
        ];

        var adapterDef = {
          find: function(col, criteria, cb) { return cb(null, _values); }
        };

        waterline.initialize({ adapters: { foo: adapterDef }}, function(err, colls) {
          if(err) done(err);
          collection = colls.person;
          done();
        });
      });


      /////////////////////////////////////////////////////
      // TEST METHODS
      ////////////////////////////////////////////////////

      it('should have a getter for preferences', function(done) {
        collection.find().exec(function(err, data) {
          if(err) return done(err);

          assert(Array.isArray(data[0].preferences));
          assert(data[0].preferences.length == 2);
          assert(data[0].preferences[0].foo === 'bar');

          assert(Array.isArray(data[1].preferences));
          assert(data[1].preferences.length == 2);
          assert(data[1].preferences[0].foo === 'a');

          done();
        });
      });

      it('should have special methods on the preference key', function(done) {
        collection.find().exec(function(err, data) {
          if(err) return done(err);

          assert(typeof data[0].preferences.add == 'function');
          assert(typeof data[0].preferences.remove == 'function');

          assert(typeof data[1].preferences.add == 'function');
          assert(typeof data[1].preferences.remove == 'function');

          done();
        });
      });

    });
  });
});
