package umm3601.todo;

import static com.mongodb.client.model.Filters.and;
import static com.mongodb.client.model.Filters.eq;
// import static com.mongodb.client.model.Filters.ne;
import static com.mongodb.client.model.Filters.regex;

import java.util.ArrayList;
import java.util.List;
// import java.util.Map;
import java.util.Objects;
import java.util.regex.Pattern;

import org.bson.Document;
import org.bson.UuidRepresentation;
import org.bson.conversions.Bson;
import org.bson.types.ObjectId;
import org.mongojack.JacksonMongoCollection;

import com.mongodb.client.FindIterable;
import com.mongodb.client.MongoDatabase;
import com.mongodb.client.model.Filters;
import com.mongodb.client.model.Sorts;
// import com.mongodb.client.result.DeleteResult;

import io.javalin.Javalin;
import io.javalin.http.BadRequestResponse;
import io.javalin.http.Context;
import io.javalin.http.HttpStatus;
import io.javalin.http.NotFoundResponse;
import umm3601.Controller;

public class TodoController implements Controller {

  private static final String API_TODO = "/api/todos";
  private static final String API_TODO_BY_ID = "/api/todos/{id}";
  static final String OWNER_KEY = "owner";
  static final String STATUS_KEY = "status";
  static final String BODY_KEY = "body";
  static final String CAT_KEY = "category";
  static final String SORT_ORDER_KEY = "sortorder";

  private final JacksonMongoCollection<Todo> todoCollection;

  // Constructs a controller for todos

  public TodoController(MongoDatabase database) {
    todoCollection = JacksonMongoCollection.builder().build(
        database,
        "todos",
        Todo.class,
        UuidRepresentation.STANDARD);
  }

  // Set the json file for a single searched `id`

  public void getTodo(Context ctx) {
    String id = ctx.pathParam("id");
    Todo todo;

    try {
      todo = todoCollection.find(eq("_id", new ObjectId(id))).first();
    } catch (IllegalArgumentException e) {
      throw new BadRequestResponse("The requested todo id wasn't a legal Mongo Object ID.");
    }
    if (todo == null) {
      throw new NotFoundResponse("The requested todo was not found");
    } else {
      ctx.json(todo);
      ctx.status(HttpStatus.OK);
    }
  }

  // Set the json file for seeing all todos

  public void getTodos(Context ctx) {
    // Build filters (status, contains, owner, category)
    Bson filter = constructFilter(ctx);

    // Parse Limit
    Integer limit = parseLimit(ctx);

    // Parse sorting order
    Bson sortingOrder = constructSortingOrder(ctx);

    // Build the MongoDB query
    FindIterable<Todo> results = todoCollection.find(filter);

    // Apply sorting if present
    if (sortingOrder != null) {
      results = results.sort(sortingOrder);
    }

    /* All the filters and sorting are put first
       to allow limiting to be the last computed */

    // Apply limit if present
    if (limit != null) {
      results = results.limit(limit);
    }

    // Materialize results
    ArrayList<Todo> matchingTodos = results.into(new ArrayList<>());

    // Return JSON
    ctx.json(matchingTodos);
    ctx.status(HttpStatus.OK);
  }

/**
 * Constructing a Bson limited to use in the `limit` method based on the
 * query parameter given from the context (ctx).
 */

  private Integer parseLimit(Context ctx) {
    // If no limit, no limit
    if (!ctx.queryParamMap().containsKey("limit")) {
      return null;
    }

    String limitParam = ctx.queryParam("limit");

    try {
      int limit = Integer.parseInt(limitParam);
      if (limit < 1) {
        throw new BadRequestResponse("The limit must be a positive integer.");
      }
      return limit;
    } catch (NumberFormatException e) {
      throw new BadRequestResponse("The limit must be a number.");
    }

  }

/**
 * Constructing a Bson filter to use in the `find` method based on the
 * query parameters given from the context (ctx).
 *
 * Checking for the presence of `owner`, `status`, `body`, and `category`
 * parameters and creating a filter document that will match todos with
 * the specified values for those fields.
 */

  private Bson constructFilter(Context ctx) {
    List<Bson> filters = new ArrayList<>(); // start with an empty list of filters

    // Owner Filter
    if (ctx.queryParamMap().containsKey(OWNER_KEY)) {
      Pattern pattern = Pattern.compile(Pattern.quote(ctx.queryParam(OWNER_KEY)));
      filters.add(regex(OWNER_KEY, pattern));
    }

    // Category Filter
    if (ctx.queryParamMap().containsKey(CAT_KEY)) {
      Pattern pattern = Pattern.compile(Pattern.quote(ctx.queryParam(CAT_KEY)), Pattern.CASE_INSENSITIVE);
      filters.add(regex(CAT_KEY, pattern));
    }

    // Status Filter
    if (ctx.queryParamMap().containsKey(STATUS_KEY)) {
      String statusParam = ctx.queryParam(STATUS_KEY);
      boolean statusValue;
      if (statusParam.equalsIgnoreCase("complete")) {
        statusValue = true;
      } else if (statusParam.equalsIgnoreCase("incomplete")) {
        statusValue = false;
      } else {
        throw new BadRequestResponse("Status must be 'complete' or 'incomplete'.");
      }
      filters.add(Filters.eq(STATUS_KEY, statusValue));
    }

    // Contains Filter
    if (ctx.queryParamMap().containsKey("contains")) {
      Pattern pattern = Pattern.compile(Pattern.quote(ctx.queryParam("contains")));
      filters.add(regex(BODY_KEY, pattern));
    }

    Bson combinedFilter = filters.isEmpty() ? new Document() : and(filters);

    return combinedFilter;
  }

  private Bson constructSortingOrder(Context ctx) {
    // Default sorting (owner)
    String sortBy = Objects.requireNonNullElse(ctx.queryParam("sortby"), OWNER_KEY);

    // Validating allowed fields
    if (!List.of(OWNER_KEY, BODY_KEY, STATUS_KEY, CAT_KEY).contains(sortBy)) {
      throw new BadRequestResponse("Invalid sortby field.");
    }

    // asc or desc, default asc
    String sortOrder = Objects.requireNonNullElse(ctx.queryParam(SORT_ORDER_KEY), "asc");

    if (sortOrder.equalsIgnoreCase("desc")) {
      return Sorts.descending(sortBy);
    } else if (sortOrder.equalsIgnoreCase("asc")) {
      return Sorts.ascending(sortBy);
    } else {
      throw new BadRequestResponse("sortorder must be 'asc' or 'desc'");
    }
  }

  // public void addNewTodo(Context ctx) {
  //   String body = ctx.body();
  //   Todo newTodo = ctx.bodyValidator(Todo.class)
  //     .check(td -> td.owner != null && td.owner.length() > 0,
  //       "Todo must have a non-empty owner name; body was " + body)
  //     .check(td -> td.body != null && td.body.length() > 0,
  //       "Todo must have a non-empty body name; body was " + body)
  //     .check(td -> td.category != null && td.category.length() > 0,
  //       "Todo must have a non-empty category name; body was " + body)
  //     .check(td -> td.status, "Todo must have a status.")
  //     .get();

  //   todoCollection.insertOne(newTodo);

  //   ctx.json(Map.of("id", newTodo._id));
  //   ctx.status(HttpStatus.CREATED);
  // }


  // public void deleteTodo(Context ctx) {
  //   String id = ctx.pathParam("id");
  //   DeleteResult deleteResult = todoCollection.deleteOne(eq("_id", new ObjectId(id)));

  //   if (deleteResult.getDeletedCount() != 1) {
  //     ctx.status(HttpStatus.NOT_FOUND);
  //     throw new NotFoundResponse(
  //       "Was unable to delete ID "
  //         + id
  //         + "; perhaps illegal ID or an ID for an item not in the system?");
  //   }
  //   ctx.status(HttpStatus.OK);
  // }

  @Override
  public void addRoutes(Javalin server) {

    server.get(API_TODO_BY_ID, this::getTodo);

    server.get(API_TODO, this::getTodos);

    // server.post(API_TODO, this::addNewTodo);

    // server.delete(API_TODO_BY_ID, this::deleteTodo);
  }

}
