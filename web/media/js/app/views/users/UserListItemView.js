/**
 * User List Item View
 *
 * @module     UserListItemView
 * @author     Ushahidi Team <team@ushahidi.com>
 * @copyright  2013 Ushahidi
 * @license    https://www.gnu.org/licenses/agpl-3.0.html GNU Affero General Public License Version 3 (AGPL3)
 */

define(['App', 'underscore', 'jquery', 'drop', 'views/ListItemView', 'hbs!templates/users/UserListItem'],
	function(App, _, $, Drop, ListItemView, template)
	{
		return ListItemView.extend(
		{
			template: template,
			className: 'list-view-user',

			events : _.extend(ListItemView.prototype.events, {
				'click .js-user-change-role' : 'changeRole'
			}),

			roleDrop: undefined,

			onDomRefresh: function()
			{
				this.roleDrop = new Drop({
					target: this.$('.js-user-change-role-drop')[0],
					content: this.$('.js-user-change-role-drop-content')[0],
					classes: 'drop-theme-arrows',
					position: 'bottom center',
					openOn: 'click',
					remove: true
				});

				var that = this;
				this.roleDrop.on('open', function() {
					$(this.content).on('click', '.js-user-change-role', function(e) {
						that.changeRole.call(that, e.originalEvent);
					});
				});
			},

			onDestroy: function()
			{
				this.roleDrop && this.roleDrop.destroy();
			},

			serializeData : function ()
			{
				return _.extend(this.model.toJSON(), {
					roles: App.Collections.Roles.toJSON(),
					selected: this.selected,
					loggedin_user: App.user.toJSON()
				});
			},

			changeRole: function(e)
			{
				e.preventDefault();
				var that = this,
					$el = $(e.target),
					role = $el.attr('data-role-name'),
					role_name = $el.text();

				alertify.confirm('Are you sure you want to assign this user the '+ role_name + ' role?' , function(e)
				{
					if(e)
					{
						that.model.set('role',role).save()
							.done(function()
							{
								alertify.success('User "' + that.model.get('username') + '" is now a '+ role_name);
							}).fail(function()
							{
								alertify.error('Unable to change role, please try again');
							});
					}
					else
					{
						alertify.log('Role change cancelled');
					}
				});
			}
		});
	});
